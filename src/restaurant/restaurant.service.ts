import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model, Types } from 'mongoose';
import { AccountServiceAbstract } from 'src/auth/account.abstract.service';
import { OrderFoodItems } from 'src/order/entities/order_food_items.schema';
import { AzureStorageService } from 'src/utils/auzre/storage-blob.service';
import { RestaurantStatus, VehicleType } from 'src/utils/enums';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { VietMapService } from 'src/utils/map-api/viet-map.service';
import { LocationObject } from 'src/utils/subschemas/location.schema';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';
import { ReviewDto } from './dto/review.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { UpdateRestaurantCategoryDto } from './dto/update-restaurant-category.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CuisineCategories } from './entities/cuisine_categories.schema';
import { Restaurant, RestaurantDocument } from './entities/restaurant.schema';
import { RestaurantCategory } from './entities/restaurant_category.schema';
import { Review } from './entities/review.schema';
import { FoodItemService } from './food_item.service';
import { ModifierService } from './modifier.service';
import { ModifierGroupService } from './modifier_groups.service';
import { RestaurantCategoryService } from './restaurant_category.service';
import { GetRestaurantsQueryDto } from './dto/get-restaurant-query.dto';
import { limits } from 'argon2';
@Injectable()
export class RestaurantService extends AccountServiceAbstract<Restaurant> {

  constructor(
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<Restaurant>,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(CuisineCategories.name) private readonly cuisineModel: Model<CuisineCategories>,
    private readonly restaurantCategoryService: RestaurantCategoryService,
    private readonly foodItemService: FoodItemService,
    private readonly modifierGroupService: ModifierGroupService,
    private readonly modifierService: ModifierService,
    private vietmapService: VietMapService,
    private firebaseService: FirebaseService,
  ) {
    super(restaurantModel);
  }

  async getFoodItems(page: number, limit: number, category_id: string = '') {
    let foods;
    if (category_id === '') {
      foods = await this.foodItemService.getFoodItems(page, limit);
    }
    else {
      const foodItems = await this.restaurantCategoryService.getFoodItems(page, limit, category_id);
      foods = foodItems[0]["food_items"];
    }
    return {
      totalPage: 0,
      foodItems: foods
    };
  }

  async getReivewsByRes(resId: string) {
    const objectId = new ObjectId(resId);
    const reviews = await this.reviewModel.aggregate([
      {
        $match: {
          reviewable_id: objectId
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'owner_id',
          foreignField: '_id',
          as: 'customer',
          pipeline: [
            {
              $project: {
                "full_name": 1,
                "avatar": 1
              }
            }
          ]
        }
      },
      {
        $unwind: '$customer'
      }
    ]);
    return reviews;
  }

  async createReview(dto: ReviewDto) {
    const review = new this.reviewModel(dto).save();
    return review;
  }

  async findFoodDetailsFromOrder(orderFoodItems: OrderFoodItems[]) {
    const newOrderFoodItems = await Promise.all(
      orderFoodItems.map(async (item) => {
        const food = await this.foodItemService.findOneById(item.food_id);

        return {
          food_id: item.food_id,
          quantity: item.food_id,
          image: food.image,
          name: food.name
        };
      }));

    return newOrderFoodItems;
  }

  async updateRestaurant(id: string, dto: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.update(id, dto as Partial<UpdateRestaurantDto>);
    return restaurant;
  }

  async updateActiveStatus(id: string, status: RestaurantStatus) {
    await this.update(id, { status });

    return {
      msg: 'update successfully'
    };
  }

  async findCategoryByRestaurant(id: string) {
    const restaurant = await this.restaurantModel.findById(id)
      .populate({
        path: 'restaurant_categories',
        model: 'RestaurantCategory',
      })
      .exec();
    return restaurant.restaurant_categories;
  }

  async findCategoriesByCustomer(id: string) {
    const objectId = new ObjectId(id);
    const categories = await this.restaurantModel.aggregate([
      {
        $match: {
          _id: objectId
        }
      },
      {
        $unwind: '$restaurant_categories'
      },
      {
        $lookup: {
          from: 'restaurantcategories',
          localField: 'restaurant_categories',
          foreignField: '_id',
          as: 'restaurantCategories',
          pipeline: [
            {
              $project: {
                "image": 1,
                "name": 1
              }
            }
          ]
        }
      },
      {
        $unwind: '$restaurantCategories'
      },
      {
        $group: {
          _id: '$_id',
          restaurant_categories: {
            $push: '$restaurantCategories'
          }
        }
      }
    ]);
    return categories[0].restaurant_categories;
  }

  async addCategory(restaurant_id: string, dto: CreateRestaurantCategoryDto): Promise<RestaurantCategory> {
    const category = await this.restaurantCategoryService.createCategory(dto);

    await this.restaurantModel.findByIdAndUpdate(restaurant_id,
      {
        $push: {
          restaurant_categories: category._id
        }
      },
      { new: true }
    ).exec();

    return category;
  }

  async food_calculateFare(dto: OrderFoodItems): Promise<number> {
    let fare = await this.foodItemService.getFoodItemPrice(dto.food_id);

    for (const item of dto.modifiers as string[]) {
      fare += await this.modifierService.getModifierPrice(item);
    }
    fare = fare * dto.quantity;
    return fare;
  }

  async updateCategory(restaurant_id: string, cate_id: string, dto: UpdateRestaurantCategoryDto): Promise<any> {
    const restaurant = await this.findOneByCondition({ _id: restaurant_id, restaurant_categories: cate_id });
    if (!restaurant) {
      throw new NotFoundException('Restaurant or Category not found');
    }
    const category = await this.restaurantCategoryService.updateCategory(cate_id, dto);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async deleteCategory(category_id: string, restaurant_id: string) {
    const restaurant = await this.findOneByCondition({ _id: restaurant_id, restaurant_categories: category_id });
    if (!restaurant) {
      throw new NotFoundException('Restaurant or Category not found');
    }

    const new_cate = restaurant.restaurant_categories.filter(cate_id => cate_id != category_id) as RestaurantCategory[];

    await this.update(restaurant_id, {
      restaurant_categories: new_cate
    });

    return await this.restaurantCategoryService.deleteCategory(category_id);
  }

  async getFooditemDetails(id: string) {
    const foodDetails = await this.foodItemService.getFoodItemDetails(id);
    return foodDetails;
  }

  async createFoodItem(restaurant_id: string, dto: CreateFoodItemDto) {
    const restaurant = await this.findOneById(restaurant_id);
    if (restaurant) {
      const foodItem = await this.foodItemService.createFoodItem(dto);
      await this.restaurantCategoryService.addFoodItem(foodItem._id, dto.category_id);
      return foodItem;
    }
    else throw new NotFoundException("Restaurant not found");
  }

  async getRestaurantLocation(restaurant_id: string) {
    const restaurant = await this.findOneById(restaurant_id);
    return restaurant.location;
  }

  async updateFoodItemImg(foodItem_id: string, img: Express.Multer.File) {
    const url = await this.firebaseService.uploadFile(foodItem_id, img);
    await this.foodItemService.updateFoodItemImg(foodItem_id, url);
    return {
      imgUrl: url
    };
  }

  async updateCategoryImg(cate_id: string, img: Express.Multer.File) {
    const url = await this.firebaseService.uploadFile(cate_id, img);
    await this.restaurantCategoryService.updateImage(cate_id, url);
    return {
      imgUrl: url
    };
  }

  async updateFoodItem(foodItem: UpdateFoodItemDto) {
    const updateFoodItemPromise = this.foodItemService.updateFoodItem(foodItem);
    const changeFoodItemCategoryPromise = this.restaurantCategoryService.updateFoodItemCategory(foodItem._id, foodItem.category_id);

    const [newFoodItem] = await Promise.all([updateFoodItemPromise, changeFoodItemCategoryPromise]);

    return newFoodItem;
  }

  async deleteFoodItem(restaurant_id: string, category_id, food_id: string) {
    const restaurant = await this.findOneByCondition({ _id: restaurant_id, restaurant_categories: category_id });
    if (!restaurant) {
      throw new NotFoundException('Restaurant or Category not found');
    }

    const newFoodItem = await this.restaurantCategoryService.deleteFoodItem(category_id, food_id);

    return newFoodItem;
  }

  async getRestaurantsByCustomer(dto: GetRestaurantsQueryDto) {
    let matchConditions: any = {};

    if (dto.categoryId) {
      if (!Types.ObjectId.isValid(dto.categoryId)) {
        throw new BadRequestException('Invalid category ID');
      }
      matchConditions.cuisine_categories = new Types.ObjectId(dto.categoryId);
    }
  
    if (dto.searchQuery) {
      const searchRegex = new RegExp(dto.searchQuery, 'i'); 
      matchConditions.$or = [
        { restaurant_name: { $regex: searchRegex } },
        { bio: { $regex: searchRegex } },
      ];
    }
    const restaurants = await this.restaurantModel.aggregate([
      { $match: matchConditions },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'reviewable_id',
          as: 'ratings',
        },
      },
      {
        $unwind: {
          path: '$ratings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          restaurant_name: { $first: '$restaurant_name' },
          bio: { $first: '$bio' },
          cuisine_categories: { $first: "$cuisine_categories" },
          avatar: { $first: '$avatar' },
          location: { $first: '$location' },
          rating: { $avg: '$ratings.rating' },
          ratingCount: { $sum: { $cond: ['$ratings.rating', 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'campaigns',
          localField: '_id',
          foreignField: 'restaurant_id',
          as: 'campaigns',
          pipeline: [{ $match: { deleted_at: null } }]
        },
      },
      {
        $unwind: {
          path: '$campaigns',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          restaurant_name: { $first: '$restaurant_name' },
          bio: { $first: '$bio' },
          cuisine_categories: { $first: '$cuisine_categories' },
          avatar: { $first: '$avatar' },
          location: { $first: '$location' },
          rating: { $first: '$rating' },
          ratingCount: { $first: '$ratingCount' },
          campaigns: { $push: '$campaigns' },
        },
      },
      {
        $lookup: {
          from: 'cuisinecategories',
          localField: 'cuisine_categories',
          foreignField: '_id',
          as: 'cuisine_categories_details',
        },
      },
      {
        $addFields: {
          cuisine_categories: '$cuisine_categories_details.name',
        },
      },
      {
        $sort: {
          rating: -1, 
          ratingCount: -1, 
        },
      },
      {
        $project: {
          _id: 1,
          restaurant_name: 1,
          bio: 1,
          cuisine_categories: 1,
          avatar: 1,
          location: 1,
          campaign_count: { $size: { $ifNull: ['$campaigns', []] } },
          rating: { $ifNull: ['$rating', 0] },
        },
      },
      { $skip: (dto.page - 1) * dto.limit },
    { $limit: dto.limit },
    ]);

    const recommendedRes = await Promise.all(
      (restaurants as Restaurant[]).map(async (res) => {
        const customerLocation = new LocationObject(dto.coordinates, '');
        const { distance, duration } = await this.vietmapService.getDistanceNDuration(res.location, customerLocation, VehicleType.BIKE);
        const { location, ...newRes } = { ...res };
        return { ...newRes, distance, duration };
      })
    );

    return {
      totalPage: Math.ceil(restaurants.length / dto.limit),
      data: recommendedRes
    };
  }

  async getMenu(id: string) {
    const restaurant = await this.findOneById(id);
    const menu = await Promise.all(
      restaurant.restaurant_categories.map(async (cate_id) => await this.restaurantCategoryService.getMenuDetails(cate_id))
    );
    return menu;
  }

  async getInfoByCustomer(id: string, coordinates: number[]) {
    const customerLocation = new LocationObject(coordinates, '');
    // const restaurant = await this.restaurantModel.findById(id, {
    //   balance: 0,
    //   verified: 0,
    //   deleted_at: 0,
    //   email: 0,
    //   password: 0,
    //   refresh_token: 0,
    //   full_name: 0,
    // }).lean();
    const objectId = new ObjectId(id);
    const restaurant = await this.restaurantModel.aggregate([
      {
        $match: {
          _id: objectId
        }
      },
      {
        $lookup: {
          from: 'cuisinecategories',
          localField: 'cuisine_categories',
          foreignField: '_id',
          as: 'cuisine_categories_details',
        },
      },
      {
        $addFields: {
          cuisine_categories: '$cuisine_categories_details.name',
        },
      },
      {
        $project: {
          _id: 1,
          restaurant_categories: 1,
          status: 1,
          restaurant_name: 1,
          bio: 1,
          tier: 1,
          location: 1,
          avatar: 1,
          cover_image: 1,
          cuisine_categories: 1,
        }
      }
    ])

    const [{ distance, duration }, ratingResult] = await Promise.all([
      this.vietmapService.getDistanceNDuration(restaurant[0].location, customerLocation, VehicleType.BIKE),
      this.reviewModel.aggregate([
        { $match: { reviewable_id: new Types.ObjectId(id) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
          },
        }
      ]),
    ]);

    const rating = ratingResult.length > 0 ? ratingResult[0].averageRating : 0;

    return {
      ...restaurant[0],
      distance,
      duration,
      rating,
    };
  }


  async createCuisineCategory(dto: { name: string, slug: string; }) {
    const cuisine = new this.cuisineModel(dto);
    return await cuisine.save();
  }

  async getCuisineCategories() {
    const cuisines = await this.cuisineModel.find();
    return cuisines;
  }

  // async getInfoByCustomer(id: string, coordinates: number[]){
  //   const restaurant = await this.restaurantModel.findById(id, {
  //     balance: 0,
  //     verified: 0,
  //     deleted_at: 0,
  //     email: 0,
  //     password: 0,
  //     refresh_token: 0,
  //     full_name: 0,
  //   }).lean();

  //   const customerLocation = new LocationObject(coordinates, '');

  //   const [{ distance, duration }, reviews] = await Promise.all([
  //     this.vietmapService.getDistanceNDuration(restaurant.location, customerLocation, VehicleType.BIKE),
  //     this.reviewModel.find({ reviewable_id: id })
  //   ]);

  //   const rating = reviews.reduce((total, curr) => {
  //     return total + curr.rating;
  //   }, 0)

  //   return {
  //     ...restaurant, distance, duration, rating: (reviews.length > 0 ? rating/reviews.length : 0)
  //   }
  // }

  async getInfo(id: string) {
    const restaurant = await this.findOneById(id);
    const { verified, email, full_name, ...restaurant_info } = (restaurant as RestaurantDocument).toJSON();
    return restaurant_info;
  }
  // // async addCategory(id: string, dto: CreateRestaurantCategoryDto): Promise<RestaurantDocument> {
  // //   const restaurant = await this.restaurantModel.findById(id).exec();
  // //   for (const item of dto.food_items) {
  // //     const newModifierGroup = new ModifierGroup(item.modifier_groups);
  // //     const newModifier = new Modifier(item.modifier_groups);
  // //     await this.modifieGroupModel.create(newModifierGroup);
  // //     await this.modifierModel.create(newModifier);
  // //   }
  // //   const newCategories = await this.restaurantCategoryModel.create(dto);
  // //   restaurant.restaurant_categories.push(newCategories);
  // //   return restaurant.save();
  // // }

  // async updateRestaurant(id: string, dto: UpdateRestaurantDto): Promise<RestaurantDocument> {
  //   const restaurant = await this.restaurantModel.findByIdAndUpdate(id, dto).exec();
  //   return restaurant;
  // }

  // async updateRestaurantTier(id: string, tier: RestaurantTier): Promise<RestaurantDocument> {
  //   const restaurant = await this.restaurantModel.findByIdAndUpdate(id, {tier:tier}).exec();
  //   return restaurant;
  // }


  // async remove(id: string) {
  //   return this.restaurantModel.findByIdAndDelete(id).exec();
  // }

  // async updateAvatar(id: string, avatar: Express.Multer.File) {
  //   const restaurant = await this.restaurantModel.findById(id).exec();
  //   if (!restaurant) {
  //     throw new Error('Restaurant not found');
  //   }
  //   const avatarUrl = await this.azureStorage.uploadFile(avatar, 'restaurant-avatar', restaurant._id);
  //   restaurant.avatar = avatarUrl;
  //   return restaurant.save();
  // }

  // //todo update cover image
  // async updateCover(id: string, cover: Express.Multer.File) {
  //   const restaurant = await this.restaurantModel.findById(id).exec();
  //   if (!restaurant) {
  //     throw new Error('Restaurant not found');
  //   }
  //   const coverUrl = await this.azureStorage.uploadFile(cover, 'restaurant-cover-img', restaurant._id);
  //   restaurant.cover_image = coverUrl;
  //   return restaurant.save();
  // }

  // //todo update item image
  // async updateItemImg(id: string, item_id: string, img: Express.Multer.File) {
  //   const imgURL = await this.azureStorage.uploadFile(img, 'restaurant-item-img', id);
  // }

  // async updateFoodItemImage(id: string, img: Express.Multer.File){
  //   const foodItem = await this.foodItemModel.findById(id).exec();
  //   if (!foodItem) {
  //     throw new Error('Food item not found');
  //   }
  //   // const foodImg = await this.azureStorage.uploadFile(img, 'restaurant-food-items', foodItem.id);
  //   // foodItem.image = foodImg;
  //   // return foodItem.save();
  //   return;
  // }

  // async fetchRestaurantMenu(restaurant_id: string) {
  //   const restaurant = await this.restaurantModel.findById(restaurant_id).exec();

  //   const restaurantMenu = restaurant.restaurant_categories.map(async (cate_id) => {
  //     const restaurant_category = await this.restaurantCategoryModel.findById(cate_id).exec();

  //     const foodItems = await Promise.all( restaurant_category.food_items.map(async (item_id) => {
  //       let food_item = await this.foodItemModel.findById(item_id).exec();

  //       const modifier_groups = await Promise.all(food_item.modifier_groups.map(async (modifierGr_id) => {
  //         const modifier_group = await this.modifieGroupModel.findById(modifierGr_id).exec()
  //         const modifiers = await Promise.all(modifier_group.modifier.map(async (modifier_id) => await this.modifierModel.findById(modifier_id)))

  //         return { ...modifier_group.toObject(), modifier: modifiers }
  //       }))

  //       return { ...food_item.toObject(), modifier_groups: modifier_groups };
  //     }))

  //     return {...restaurant_category.toObject(), food_items: foodItems};
  //   });

  //   const menu = await Promise.all(restaurantMenu);
  //   return menu;
  // }

  // async createFoodItem(id: string, foodItem: CreateFoodItemDto, img: Express.Multer.File): Promise<FoodItemDocument>{
  //   const restaurant = await this.restaurantModel.findById(id).exec();
  //   if (!restaurant) {
  //     throw new Error('Restaurant not found');
  //   }

  //   const restaurantCategory = await this.restaurantCategoryModel.findById(foodItem.category_id).exec();
  //   if (!restaurantCategory) {
  //     throw new Error('Restaurant category not found');
  //   }
  //   const newFoodItem = new this.foodItemModel(foodItem);
  //   newFoodItem.modifier_groups = []
  //   if(newFoodItem){
  //     newFoodItem.image = '';
  //     if(img){
  //       const foodImg = await this.azureStorage.uploadFile(img, 'restaurant-food-items', newFoodItem.id);
  //       if(!foodImg){
  //         throw new Error('Upload image failed');
  //       }
  //       newFoodItem.image = foodImg;
  //     }
  //     restaurantCategory.food_items.push(newFoodItem.id)
  //     if('modifier_groups' in foodItem){
  //       for(const modifierGr of foodItem.modifier_groups) {
  //         const mGr = new this.modifieGroupModel(modifierGr)
  //         mGr.modifier = []
  //         if(mGr){
  //           newFoodItem.modifier_groups.push(mGr.id)
  //           for (const md of modifierGr.modifier) {
  //             const modifier = new this.modifierModel(md);
  //             await modifier.save();
  //             mGr.modifier.push(modifier.id);
  //           }
  //           await mGr.save();
  //         }
  //       }
  //     }
  //     await restaurantCategory.save();
  //     return newFoodItem.save();
  //   }  
  //   else{
  //     throw new Error('Create food item failed')
  //   }
  // }
}
