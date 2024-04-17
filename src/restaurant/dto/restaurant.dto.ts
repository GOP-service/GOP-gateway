import { ApiProperty } from "@nestjs/swagger";
import { CuisinesCategory, RestaurantStatus } from "src/utils/enums";
import { RestaurantCategory, RestaurantCategorySchema } from "../entities/restaurant_category.schema";
import { IsEmpty, IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";
import { LocationObject } from "src/utils/subschemas/location.schema";

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
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string
    
    @ApiProperty({
        example: new LocationObject([10.850739590040357,106.77195728296408])
    })
    @IsNotEmpty()
    location: LocationObject
    
    @ApiProperty({
        example: 'say oh yeahhhhhhh'
    })
    @IsNotEmpty()
    @IsString()
    bio: string
    
    @ApiProperty()
    avatar: string
    
    @ApiProperty()
    cover_image: string
    
    @ApiProperty({})
    restaurant_categories: RestaurantCategory[]
    
}