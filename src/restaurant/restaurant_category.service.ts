import { RestaurantCategory, RestaurantCategoryDocument } from "./entities/restaurant_category.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { CreateRestaurantCategoryDto } from "./dto/create-restaurant-category.dto";
import { UpdateRestaurantCategoryDto } from "./dto/update-restaurant-category.dto";

@Injectable()
export class RestaurantCategoryService extends BaseServiceAbstract<RestaurantCategory> {
    constructor(
        @InjectModel(RestaurantCategory.name) private readonly restaurantCategoryModel: Model<RestaurantCategory>,
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

    async addFoodItem(food_item_id: string, category_id: string){
        return await this.restaurantCategoryModel.findByIdAndUpdate(category_id, { 
            $push: {
              food_items: food_item_id
            }
          },
        { new: true })
    } 
}