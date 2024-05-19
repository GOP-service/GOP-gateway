import { PartialType } from "@nestjs/swagger";
import { RestaurantCategory } from "../entities/restaurant_category.schema";

export class UpdateRestaurantCategoryDto extends PartialType(RestaurantCategory){}