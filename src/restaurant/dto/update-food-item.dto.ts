import { PartialType } from "@nestjs/swagger";
import { FoodItemDto } from "./food-item.dto";

export class UpdateFoodItemDto extends PartialType(FoodItemDto) {
    category_id: string;
}