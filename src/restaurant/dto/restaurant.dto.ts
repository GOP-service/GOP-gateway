import { ApiProperty } from "@nestjs/swagger";
import { CuisinesCategory, RestaurantStatus } from "src/utils/enums";
import { RestaurantCategory, RestaurantCategorySchema } from "../entities/restaurant_category.schema";
import { IsEnum, IsObject } from "class-validator";

export class RestaurantDto{
    @ApiProperty()
    @IsEnum(CuisinesCategory, { each: true })
    cuisine_categories: CuisinesCategory[]

    @ApiProperty()
    restaurant_categories: RestaurantCategory[]

    @ApiProperty()
    @IsEnum(RestaurantStatus)
    status: RestaurantStatus

    @ApiProperty()
    name: string

    @ApiProperty()
    address: string

    @ApiProperty()
    bio: string

    @ApiProperty()
    avatar: string

    @ApiProperty()
    cover_image: string

}