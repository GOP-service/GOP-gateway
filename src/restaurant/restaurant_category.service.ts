import { RestaurantCategory, RestaurantCategoryDocument } from "./entities/restaurant_category.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, QueryOptions } from "mongoose";
import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { CreateRestaurantCategoryDto } from "./dto/create-restaurant-category.dto";
import { UpdateRestaurantCategoryDto } from "./dto/update-restaurant-category.dto";
import { FoodItemService } from "./food_item.service";
import { FindAllResponse } from "src/utils/interfaces";

@Injectable()
export class RestaurantCategoryService extends BaseServiceAbstract<RestaurantCategory> {
    constructor(
        @InjectModel(RestaurantCategory.name) private readonly restaurantCategoryModel: Model<RestaurantCategory>,
        private readonly foodItemService: FoodItemService
    ){
        super(restaurantCategoryModel);
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
            model: 'FoodItem'
        }).exec();
        return cate;
    }
}