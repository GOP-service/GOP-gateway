import { ApiProperty } from "@nestjs/swagger";
import { CuisinesCategory, RestaurantStatus } from "src/utils/enums";
import { RestaurantCategory, RestaurantCategorySchema } from "../entities/restaurant_category.schema";
import { IsEmpty, IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";

export class RestaurantDto{
    @ApiProperty(
        {
            enum: CuisinesCategory,
            isArray: true,
            type: [String],
            default: [CuisinesCategory.BANH_MI, CuisinesCategory.NOODLES, CuisinesCategory.RICE],
        }
    )
    @IsNotEmpty()
    @IsEnum(CuisinesCategory, { each: true })
    cuisine_categories: CuisinesCategory[]

    @ApiProperty({})
    restaurant_categories: RestaurantCategory[]

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    bio: string

    @ApiProperty()
    avatar: string

    @ApiProperty()
    cover_image: string

}