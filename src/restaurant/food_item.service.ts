import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { FoodItem, FoodItemDocument } from "./entities/food_item.schema";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class FoodItemService extends BaseServiceAbstract<FoodItem> {
    constructor(
        @InjectModel(FoodItem.name) private readonly foodItemModel: Model<FoodItem>,
    ){
        super(foodItemModel);
    }
}