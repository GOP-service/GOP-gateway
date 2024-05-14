import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsObject, IsString, min } from "class-validator"
import { FoodItem } from "../entities/food_item.schema"
import { ModifierGroup } from "../entities/modifier_groups.schema"
import { Modifier } from "../entities/modifier.schema"

export class RestaurantCategoryDto {
    @ApiProperty({
        examples: ['Ăn sáng', 'Ăn trưa', 'Ăn tối', 'Ăn vặt', 'Đồ uống']
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({
        example: 'say oh yeahhhhhh!!!'
    })
    @IsString()
    bio: string


    @ApiProperty({
        example:
        [
            // new FoodItem('Bún đậu mắm tôm', 'Bún đậu mắm tôm siu to khổng lồ', 30000, [
            //     new ModifierGroup('Chọn thêm',[
            //         new Modifier('Đậu hủ', 5000),
            //         new Modifier('Nem chua', 5000),
            //         new Modifier('Chả cá', 5000),
            //     ]),
            //     new ModifierGroup('Chọn nước mắm', [
            //         new Modifier('Nước mắm', 5000),
            //         new Modifier('Nước mắm chua ngọt', 5000),
            //         new Modifier('Nước mắm pha', 5000),
            //     ])
            // ]),
            // new FoodItem('Bún bò Huế', 'Bún bò Huế siu to khổng lồ', 30000, [
            //     new ModifierGroup('Chọn thêm',[
            //         new Modifier('Bún', 5000),
            //         new Modifier('Thịt', 5000),
            //         new Modifier('Bò viên', 5000),
            //     ]),
            //     new ModifierGroup('Chọn size', [
            //         new Modifier('Nhỏ', 0),
            //         new Modifier('To', 5000),
            //     ])
            // ]),
            // new FoodItem('Trà sữa trân châu', 'Trà sữa trân châu phô mai hột vịt siu to khổng lồ', 30000, [
            //     new ModifierGroup('Chọn thêm',[
            //         new Modifier('Trân châu', 5000),
            //         new Modifier('Phô mai', 5000),
            //         new Modifier('Hột vịt', 5000),
            //     ]),
            //     new ModifierGroup('Chọn size', [
            //         new Modifier('Nhỏ', 0),
            //         new Modifier('To', 5000),
            //     ])
            // ]),
            // new FoodItem('Trà sữa thái đỏ', 'Trà sữa thái đỏ siu to khổng lồ', 30000, [
            //     new ModifierGroup('Chọn thêm',[
            //         new Modifier('Trân châu', 5000),
            //         new Modifier('Phô mai', 5000),
            //         new Modifier('Hột vịt', 5000),
            //     ]),
            //     new ModifierGroup('Chọn size', [
            //         new Modifier('Nhỏ', 0),
            //         new Modifier('To', 5000),
            //     ])
            // ]),
        ],

    })
    @IsArray()
    food_items: FoodItem[]
}