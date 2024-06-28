import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { FoodItem, FoodItemDocument } from "./entities/food_item.schema";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateFoodItemDto } from "./dto/create-food-item.dto";
import { ModifierGroupService } from "./modifier_groups.service";
import { FoodItemDto } from "./dto/food-item.dto";
import { ModifierGroup } from "./entities/modifier_groups.schema";
import { UpdateFoodItemDto } from "./dto/update-food-item.dto";

@Injectable()
export class FoodItemService extends BaseServiceAbstract<FoodItem> {
    constructor(
        @InjectModel(FoodItem.name) private readonly foodItemModel: Model<FoodItem>,
        private readonly modiferGroupService: ModifierGroupService
    ){
        super(foodItemModel);
    }

    async createFoodItem(dto: CreateFoodItemDto) {
        const mg = await this.modiferGroupService.createModifieriGroupList(dto.modifier_groups as ModifierGroup[])
        dto.modifier_groups = mg
        return await this.create(dto);
    }

    async updateFoodItem(id: string, dto: UpdateFoodItemDto) {
        // const mg = await this.modiferGroupService.createModifieriGroupList(dto.modifier_groups as ModifierGroup[])
        // dto.modifier_groups = mg
        // return await this.update(id, dto);
    }

    async updateFoodItemImg(id: string, imgUrl: string) {
        const img = await this.update(id, {
            image: imgUrl
        })
    }

    async deleteFoodItem(id: string) {
        const now = new Date(); 
        now.setTime(now.getTime() + (7 * 60 * 60 * 1000)); 
        const foodItem = await this.update(id, {
            deleted_at: now
        })
        return foodItem;
    }

    async getFoodItemPrice(id: string): Promise<number> {
        const foodItem = await this.findOneById(id);
        return foodItem.price
    }

    async getFoodItemDetails(id: string) {
        const food = await this.foodItemModel
          .findById(id)
          .populate({ 
              path: 'modifier_groups',
              populate: {
                path: 'modifier',
                model: 'Modifier'
              } 
           })
          .exec();
      
        return food ? food.toJSON() : null;
      }
}