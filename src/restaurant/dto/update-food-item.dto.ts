import { PartialType } from "@nestjs/swagger";
import { CreateFoodItemDto } from "./create-food-item.dto";

export class UpdateFoodItemDto extends PartialType(CreateFoodItemDto) {
}