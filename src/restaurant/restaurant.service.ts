import { Injectable } from '@nestjs/common';
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

@Injectable()
export class RestaurantService {

  constructor(
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<RestaurantDocument>,
    @InjectModel(RestaurantFoodReview.name) private readonly restaurantFoodReviewModel: Model<RestaurantFoodReviewDocument>,
    @InjectModel(RestaurantCategory.name) private readonly restaurantCategoryModel: Model<RestaurantCategoryDocument>,
    @InjectModel(ModifierGroup.name) private readonly modifieGroupModel: Model<ModifierGroupDocument>,
    @InjectModel(Modifier.name) private readonly modifierModel: Model<ModifierDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    @InjectModel(FoodItem.name) private readonly foodItemModel: Model<FoodItemDocument>,
    private azureStorage: AzureStorageService
  ) {}

  async create(dto: CreateRestaurantDto): Promise<RestaurantDocument> {
    const createdRestaurant = new this.restaurantModel(dto);
    return createdRestaurant.save();
  }

  async createCategory(id: string,dto: CreateRestaurantCategoryDto): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    const category = new this.restaurantCategoryModel(dto);
    category.save();
    restaurant.restaurant_categories.push(category.id)
    return restaurant.save();
  }

  async updateCategories(id: string, dto: UpdateItemsRestaurantDto, index: number): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    const newCategories = new RestaurantCategory(dto);
    restaurant.restaurant_categories[index] = newCategories;
    
    return restaurant.save();
  }
  
  // async addCategory(id: string, dto: CreateRestaurantCategoryDto): Promise<RestaurantDocument> {
  //   const restaurant = await this.restaurantModel.findById(id).exec();
  //   for (const item of dto.food_items) {
  //     const newModifierGroup = new ModifierGroup(item.modifier_groups);
  //     const newModifier = new Modifier(item.modifier_groups);
  //     await this.modifieGroupModel.create(newModifierGroup);
  //     await this.modifierModel.create(newModifier);
  //   }
  //   const newCategories = await this.restaurantCategoryModel.create(dto);
  //   restaurant.restaurant_categories.push(newCategories);
  //   return restaurant.save();
  // }

  async updateRestaurant(id: string, dto: UpdateRestaurantDto): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findByIdAndUpdate(id, dto).exec();
    return restaurant;
  }

  async updateRestaurantTier(id: string, tier: RestaurantTier): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findByIdAndUpdate(id, {tier:tier}).exec();
    return restaurant;
  }

  async findAll(): Promise<RestaurantDocument[]> {
    return this.restaurantModel.find().exec();
  }

  async findOneId(id: string): Promise<RestaurantDocument> {
    return this.restaurantModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateRestaurantDto): Promise<RestaurantDocument> {
    return this.restaurantModel.findByIdAndUpdate(id, dto, {new: true}).exec();
  }

  async remove(id: string) {
    return this.restaurantModel.findByIdAndDelete(id).exec();
  }

  async updateAvatar(id: string, avatar: Express.Multer.File) {
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    const avatarUrl = await this.azureStorage.uploadFile(avatar, 'restaurant-avatar', restaurant._id);
    restaurant.avatar = avatarUrl;
    return restaurant.save();
  }

  //todo update cover image
  async updateCover(id: string, cover: Express.Multer.File) {
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    const coverUrl = await this.azureStorage.uploadFile(cover, 'restaurant-cover-img', restaurant._id);
    restaurant.cover_image = coverUrl;
    return restaurant.save();
  }

  //todo update item image
  async updateItemImg(id: string, item_id: string, img: Express.Multer.File) {
    const imgURL = await this.azureStorage.uploadFile(img, 'restaurant-item-img', id);
  }

  async updateFoodItemImage(id: string, img: Express.Multer.File){
    const foodItem = await this.foodItemModel.findById(id).exec();
    if (!foodItem) {
      throw new Error('Food item not found');
    }
    // const foodImg = await this.azureStorage.uploadFile(img, 'restaurant-food-items', foodItem.id);
    // foodItem.image = foodImg;
    // return foodItem.save();
    return;
  }

  async fetchRestaurantMenu(restaurant_id: string) {
    const restaurant = await this.restaurantModel.findById(restaurant_id).exec();
  
    const restaurantMenu = restaurant.restaurant_categories.map(async (cate_id) => {
      const restaurant_category = await this.restaurantCategoryModel.findById(cate_id).exec();

      const foodItems = await Promise.all( restaurant_category.food_items.map(async (item_id) => {
        let food_item = await this.foodItemModel.findById(item_id).exec();

        const modifier_groups = await Promise.all(food_item.modifier_groups.map(async (modifierGr_id) => {
          const modifier_group = await this.modifieGroupModel.findById(modifierGr_id).exec()
          const modifiers = await Promise.all(modifier_group.modifier.map(async (modifier_id) => await this.modifierModel.findById(modifier_id)))
          
          return { ...modifier_group.toObject(), modifier: modifiers }
        }))

        return { ...food_item.toObject(), modifier_groups: modifier_groups };
      }))

      return {...restaurant_category.toObject(), food_items: foodItems};
    });
  
    const menu = await Promise.all(restaurantMenu);
    return menu;
  }

  async createFoodItem(id: string, foodItem: CreateFoodItemDto, img: Express.Multer.File): Promise<FoodItemDocument>{
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const restaurantCategory = await this.restaurantCategoryModel.findById(foodItem.category_id).exec();
    if (!restaurantCategory) {
      throw new Error('Restaurant category not found');
    }
    const newFoodItem = new this.foodItemModel(foodItem);
    newFoodItem.modifier_groups = []
    if(newFoodItem){
      newFoodItem.image = '';
      if(img){
        const foodImg = await this.azureStorage.uploadFile(img, 'restaurant-food-items', newFoodItem.id);
        if(!foodImg){
          throw new Error('Upload image failed');
        }
        newFoodItem.image = foodImg;
      }
      restaurantCategory.food_items.push(newFoodItem.id)
      if('modifier_groups' in foodItem){
        for(const modifierGr of foodItem.modifier_groups) {
          const mGr = new this.modifieGroupModel(modifierGr)
          mGr.modifier = []
          if(mGr){
            newFoodItem.modifier_groups.push(mGr.id)
            for (const md of modifierGr.modifier) {
              const modifier = new this.modifierModel(md);
              await modifier.save();
              mGr.modifier.push(modifier.id);
            }
            await mGr.save();
          }
        }
      }
      await restaurantCategory.save();
      return newFoodItem.save();
    }  
    else{
      throw new Error('Create food item failed')
    }
  }
}
