import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant, RestaurantDocument } from './entities/restaurant.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RestaurantCategory, RestaurantCategoryDocument } from './entities/restaurant_category.schema';
import { RestaurantFoodReview, RestaurantFoodReviewDocument, } from './entities/restaurant_food_review.schema';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<RestaurantDocument>,
    @InjectModel(RestaurantCategory.name) private readonly restaurantCategoryModel: Model<RestaurantCategoryDocument>,
    @InjectModel(RestaurantFoodReview.name) private readonly restaurantFoodReviewModel: Model<RestaurantFoodReviewDocument>,
  ) {}

  async create(dto: CreateRestaurantDto): Promise<RestaurantDocument> {
    const createdRestaurant = new this.restaurantModel(dto);
    return createdRestaurant.save();
  }

  async updateCategories(id: string, dto: CreateRestaurantCategoryDto): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    const newCategories = await new this.restaurantCategoryModel(dto).save(); //!! nhớ thêm .save() trước khi push
    restaurant.restaurant_categories.push(newCategories);
    
    return restaurant.save();
    // return restaurant;
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
