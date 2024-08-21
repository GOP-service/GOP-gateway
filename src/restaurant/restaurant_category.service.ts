import { RestaurantCategory, RestaurantCategoryDocument } from "./entities/restaurant_category.schema";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, QueryOptions } from "mongoose";
import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { CreateRestaurantCategoryDto } from "./dto/create-restaurant-category.dto";
import { UpdateRestaurantCategoryDto } from "./dto/update-restaurant-category.dto";
import { FoodItemService } from "./food_item.service";
import { FindAllResponse } from "src/utils/interfaces";
import { FoodItem } from "./entities/food_item.schema";
import { ObjectId } from 'mongodb';
@Injectable()
export class RestaurantCategoryService extends BaseServiceAbstract<RestaurantCategory> {
    constructor(
        @InjectModel(RestaurantCategory.name) private readonly restaurantCategoryModel: Model<RestaurantCategory>,
        private readonly foodItemService: FoodItemService
    ){
        super(restaurantCategoryModel);
    }
    
    async getFoodItems(page: number, limit: number, category_id: string = '') {
        const objectId = new ObjectId(category_id);
        const foodItems = this.restaurantCategoryModel.aggregate([
            {
                $match: {
                    _id: objectId
                },
            },
            {
                $lookup: {
                  from: 'fooditems', 
                  localField: 'food_items', 
                  foreignField: '_id',
                  as: 'food_items_details'
                }
            },
            {
                $project: {
                    _id: 0,
                    food_items: '$food_items_details'
                }
              }
        ])
        return foodItems
    }

    async updateImage(id: string, image:  string) {
        await this.restaurantCategoryModel.findByIdAndUpdate(id, {
            image: image
        }, { new: true }).exec();
    }

    async createCategory(dto: CreateRestaurantCategoryDto){
        const category = await this.create(dto)
        return category;
    }

    async updateCategory(cate_id: string, dto: UpdateRestaurantCategoryDto) {
        const category = await this.update(cate_id, { name: dto.name, bio: dto.bio })
        return category;
    }

    async deleteCategory(cate_id: string) {
        const now = new Date(); 
        now.setTime(now.getTime() + (7 * 60 * 60 * 1000)); 
        const category = await this.update(cate_id, {
            deleted_at: now
        })
        return category;
    }

    async updateFoodItemCategory(food_item_id: string, category_id: string) {
        const currCategory = await this.findOneByCondition({
            food_items: food_item_id
        })

        if(category_id != currCategory._id) {
            const newCate = await this.findOneById(category_id);
            if(!newCate) {
                throw new NotFoundException('new category not found')
            }

            await Promise.all([
                this.removeFoodItem(food_item_id, currCategory._id),
                this.addFoodItem(food_item_id, category_id)
            ])
        }

    }

    async findCategoriesByFoodItemId (food_item_id: string) {
        const categories = await this.findOneByCondition({
            food_items: food_item_id
        })
        return categories;
    }

    async removeFoodItem(food_item_id: string, category_id: string) {
        const result = await this.restaurantCategoryModel.findByIdAndUpdate(
            category_id,
            { $pull: { food_items: food_item_id } },
            { new: true }
          );
      
        if (!result) {
            throw new NotFoundException('Category or FoodItem not found');
        }
    }

    async addFoodItem(food_item_id: string, category_id: string){
        return await this.restaurantCategoryModel.findByIdAndUpdate(category_id, { 
            $push: {
              food_items: food_item_id
            }
          },
        { new: true })
    } 

    async getMenuDetails(id: string) {
        const cate = await this.restaurantCategoryModel.findById(id)
        .populate({
            path: 'food_items',
            model: 'FoodItem',
            match: { deleted_at: null }
        }).exec();
        return cate;
    }

    async deleteFoodItem(category_id: string, food_id: string) {
        const category = await this.findOneByCondition({ _id: category_id, food_items: food_id })
        if (!category) {
          throw new NotFoundException('Category not found');
        }

        const newFoodItems = category.food_items.filter(itemId => itemId !== food_id) as string[]

        await this.restaurantCategoryModel.findByIdAndUpdate(category_id, {
            food_items: newFoodItems
        }, { new: true })

        return await this.foodItemService.deleteFoodItem(food_id);
    }
}