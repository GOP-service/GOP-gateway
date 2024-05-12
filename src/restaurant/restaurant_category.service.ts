import { RestaurantCategory } from "./entities/restaurant_category.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseServiceAbstract } from "src/utils/repository/base.service";

@Injectable()
export class RestaurantCategoryService extends BaseServiceAbstract<RestaurantCategory> {
    constructor(
        @InjectModel(RestaurantCategory.name) private readonly restaurantCategoryModel: Model<RestaurantCategory>,
    ){
        super(restaurantCategoryModel);
    }
}