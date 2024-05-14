import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { FoodItem, FoodItemDocument } from "./entities/food_item.schema";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateFoodItemDto } from "./dto/create-food-item.dto";
import { ModifierGroupService } from "./modifier_groups.service";
import { FoodItemDto } from "./dto/food-item.dto";
import { ModifierGroup } from "./entities/modifier_groups.schema";

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
}