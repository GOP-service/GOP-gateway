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
import { ModifierGroup } from './entities/modifier_groups.schema';
import { Modifier, ModifierDocument } from './entities/modifier.schema';
import { Otp, OtpDocument } from 'src/auth/entities/otp.schema';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<RestaurantDocument>,
    @InjectModel(RestaurantFoodReview.name) private readonly restaurantFoodReviewModel: Model<RestaurantFoodReviewDocument>,
    @InjectModel(RestaurantCategory.name) private readonly restaurantCategoryModel: Model<RestaurantCategoryDocument>,
    @InjectModel(ModifierGroup.name) private readonly modifieGroupModel: Model<ModifierDocument>,
    @InjectModel(Modifier.name) private readonly modifierModel: Model<ModifierDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>
  ) {}

  async create(dto: CreateRestaurantDto): Promise<RestaurantDocument> {
    const createdRestaurant = new this.restaurantModel(dto);
    return createdRestaurant.save();
  }

  async updateCategories(id: string, dto: UpdateItemsRestaurantDto, index: number): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    const newCategories = new RestaurantCategory(dto);
    restaurant.restaurant_categories[index] = newCategories;
    
    return restaurant.save();
    // return restaurant;
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
}
