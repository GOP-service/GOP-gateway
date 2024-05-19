import { PartialType } from "@nestjs/swagger";
import { RestaurantCategory } from "../entities/restaurant_category.schema";
import { RestaurantCategoryDto } from "./restaurant-category.dto";

export class UpdateRestaurantCategoryDto extends PartialType(RestaurantCategoryDto){}