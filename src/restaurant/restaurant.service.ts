import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant, RestaurantDocument } from './entities/restaurant.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(dto: CreateRestaurantDto): Promise<RestaurantDocument> {
    const createdRestaurant = new this.restaurantModel(dto);
    return createdRestaurant.save();
  }

  async findAll(): Promise<RestaurantDocument[]> {
    return this.restaurantModel.find().exec();
  }

  async findOne(id: string): Promise<RestaurantDocument> {
    return this.restaurantModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateRestaurantDto): Promise<RestaurantDocument> {
    return this.restaurantModel.findByIdAndUpdate(id, dto, {new: true}).exec();
  }

  async remove(id: string) {
    return this.restaurantModel.findByIdAndDelete(id).exec();
  }1

}
