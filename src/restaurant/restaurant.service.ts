import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant, RestaurantDocument } from './entities/restaurant.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RestaurantCategory, RestaurantCategoryDocument } from './entities/restaurant_category.schema';
import { RestaurantFoodReview, RestaurantFoodReviewDocument, } from './entities/restaurant_food_review.schema';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';
import { RestaurantDto } from './dto/restaurant.dto';
import { OTPType, OTPVerifyStatus, RestaurantTier } from 'src/utils/enums';
import { UpdateItemsRestaurantDto } from './dto/update-item-restaurant-category.dto';
import { ModifierGroup, ModifierGroupDocument } from './entities/modifier_groups.schema';
import { Modifier, ModifierDocument } from './entities/modifier.schema';
import { Otp, OtpDocument } from 'src/auth/entities/otp.schema';
import { AzureStorageService } from 'src/utils/auzre/storage-blob.service';
import { FoodItem, FoodItemDocument } from './entities/food_item.schema';
import { FoodItemDto } from './dto/food-item.dto';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { ModifierGroupsDto } from './dto/modifier-groups.dto';
import { AccountServiceAbstract } from 'src/auth/account.abstract.service';
import { BaseServiceAbstract } from 'src/utils/repository/base.service';
import { FoodItemService } from './food_item.service';
import { RestaurantCategoryService } from './restaurant_category.service';
import { ModifierGroupService } from './modifier_groups.service';
import { ModifierService } from './modifier.service';
import { UpdateRestaurantCategoryDto } from './dto/update-restaurant-category.dto';

@Injectable()
export class RestaurantService extends AccountServiceAbstract<Restaurant>{

  constructor(
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<Restaurant>,
    private readonly restaurantCategoryService: RestaurantCategoryService,
    private readonly foodItemService: FoodItemService,
    private readonly modifierGroupService: ModifierGroupService,
    private readonly modifierService: ModifierService,
    private azureStorage: AzureStorageService,
  ) {
    super(restaurantModel);
  }


  async updateRestaurant(id: string, dto: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.update(id, dto as Partial<UpdateRestaurantDto>)
    return restaurant;
  }

  async addCategory(restaurant_id: string, dto: CreateRestaurantCategoryDto): Promise<RestaurantDocument>{
    const category = await this.restaurantCategoryService.createCategory(dto);

    const restaurant = await this.restaurantModel.findByIdAndUpdate(restaurant_id, 
      { 
        $push: {
          restaurant_categories: category._id
        }
      },
      { new: true }
    ).exec();

    return restaurant;
  }

  async updateCategory(restaurant_id: string, cate_id: string, dto: UpdateRestaurantCategoryDto): Promise<RestaurantCategory> {
    if(this.isCategoryOwnedByRestaurant(restaurant_id, cate_id)){
      const category = await this.restaurantCategoryService.updateCategory(cate_id ,dto);
      return category;
    }
    else throw new NotFoundException("Restaurant not found")
  }

  async isCategoryOwnedByRestaurant(restaurant_id: string, cate_id: string): Promise<boolean> {
    const restaurant = await this.findOneById(restaurant_id);
    return  restaurant && (restaurant.restaurant_categories.filter(cate => (cate as RestaurantCategory)._id == cate_id || (cate as string) == cate_id )).length > 0;
  }
  
  async deleteCategory(category_id: string, restaurant_id: string) {
    if(this.isCategoryOwnedByRestaurant(restaurant_id, category_id)){
      const restaurant = await this.findOneById(restaurant_id)
      const new_cate = restaurant.restaurant_categories.filter(cate_id => cate_id != category_id) as RestaurantCategory[]

      await this.update(restaurant_id, {
        restaurant_categories: new_cate
      })
      
      return await this.restaurantCategoryService.deleteCategory(category_id)
    }
  }

  async createFoodItem(restaurant_id: string, dto: CreateFoodItemDto){
    const restaurant = await this.findOneById(restaurant_id);
    if(restaurant){
      const foodItem = await this.foodItemService.createFoodItem(dto);
      this.restaurantCategoryService.addFoodItem(foodItem._id, dto.category_id)
      return foodItem;
    }
    else throw new Error("Invalid restaurant")
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
