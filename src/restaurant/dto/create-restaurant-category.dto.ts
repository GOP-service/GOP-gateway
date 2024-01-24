import { ApiProperty, OmitType } from "@nestjs/swagger";
import { RestaurantCategoryDto } from "./restaurant-category.dto";
import { Min } from "class-validator";

export class CreateRestaurantCategoryDto extends OmitType(RestaurantCategoryDto, ['image'] as const){
}