import { PartialType } from "@nestjs/swagger";
import { RestaurantCategoryDto } from "./restaurant-category.dto";

export class UpdateRestaurantCategoryDto extends PartialType(RestaurantCategoryDto){}