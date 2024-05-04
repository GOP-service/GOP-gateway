import { ApiProperty } from "@nestjs/swagger";
import { FoodItemDto } from "./food-item.dto";
import { IsNotEmpty } from "class-validator";

export class CreateFoodItemDto extends (FoodItemDto){
    @ApiProperty({
        example: '1'
    })
    @IsNotEmpty()
    category_id: string
}