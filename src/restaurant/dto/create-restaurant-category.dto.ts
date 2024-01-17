import { OmitType } from "@nestjs/swagger";
import { RestaurantCategoryDto } from "./restaurant-category.dto";

export class CreateRestaurantCategoryDto extends OmitType(RestaurantCategoryDto, ['image'] as const){
}