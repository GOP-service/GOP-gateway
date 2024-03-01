import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant, RestaurantDocument } from './entities/restaurant.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RestaurantCategory } from './entities/restaurant_category.schema';
import { RestaurantFoodReview, RestaurantFoodReviewDocument, } from './entities/restaurant_food_review.schema';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';
import { RestaurantDto } from './dto/restaurant.dto';
import { RestaurantCategoryDto } from './dto/restaurant-category.dto';
import { RestaurantTier } from 'src/utils/enums';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<RestaurantDocument>,
    @InjectModel(RestaurantFoodReview.name) private readonly restaurantFoodReviewModel: Model<RestaurantFoodReviewDocument>,
    
  ) {}

  async create(dto: CreateRestaurantDto): Promise<RestaurantDocument> {
    const createdRestaurant = new this.restaurantModel(dto);
    return createdRestaurant.save();
  }

  async updateCategories(id: string, dto: CreateRestaurantCategoryDto, index: number): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    const newCategories = new RestaurantCategory(dto);
    restaurant.restaurant_categories[index] = newCategories;
    
    return restaurant.save();
    // return restaurant;
  }

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

  async findOneId(id: string): Promise<RestaurantDocument[]> {
    // return this.restaurantModel.findById(id).exec();
    const restaurant = await this.restaurantModel.aggregate([{
      $match:{name:{$eq:'string'}}
    }]);
    return restaurant
  }

  async update(id: string, dto: UpdateRestaurantDto): Promise<RestaurantDocument> {
    return this.restaurantModel.findByIdAndUpdate(id, dto, {new: true}).exec();
  }

  async remove(id: string) {
    return this.restaurantModel.findByIdAndDelete(id).exec();
  }

}
