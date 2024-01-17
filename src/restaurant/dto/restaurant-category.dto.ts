import { PriceOption } from "src/utils/subschemas/priceoption.schema"
import { RestaurantFood } from "../entities/restaurant_food.schema"
import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsObject, IsString } from "class-validator"

export class RestaurantCategoryDto {
    @ApiProperty({
        examples: ['Ăn sáng', 'Ăn trưa', 'Ăn tối', 'Ăn vặt', 'Đồ uống']
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty()
    image: string

    @ApiProperty({
        example: 'say oh yeahhhhhh!!!'
    })
    @IsNotEmpty()
    @IsString()
    bio: string

    @ApiProperty({
        example: [
            new PriceOption('thêm mắm', '1 tý nước mắm', 10000), 
            new PriceOption('thêm muối', '1 tý muối', 20000), 
            new PriceOption('thêm ớt', '1 đống ớt', 30000)
        ]
    })
    @IsNotEmpty()    
    options: PriceOption[]

    @ApiProperty({
        example:[
            new RestaurantFood(
                'Bánh mì', 
                'Bánh mì thịt nguội', 
                [
                    new PriceOption('Nhỏ', 'size siu bé', 10000), 
                    new PriceOption('Vừa', 'size human', 20000), 
                    new PriceOption('Lớn', 'size khủng long', 30000)
                ]),
            new RestaurantFood(
                'cơm 8', 
                'cơm tấm thịt nướng', 
                [
                    new PriceOption('Nhỏ', 'size siu bé', 10000), 
                    new PriceOption('Vừa', 'size human', 20000), 
                    new PriceOption('Lớn', 'size khủng long', 30000)
                ]),
        ]
    })
    @IsNotEmpty()
    food_items: RestaurantFood[]
}