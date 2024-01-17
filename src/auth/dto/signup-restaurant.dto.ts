import { IntersectionType, OmitType } from "@nestjs/swagger";
import { SigninDto } from "./signin.dto";
import { RestaurantDto } from "src/restaurant/dto/restaurant.dto";
import { CreateAccountDto } from "./create-acc.dto";

export class SignupRestaurantDto extends IntersectionType(
    CreateAccountDto,
    OmitType(RestaurantDto, ['avatar','cover_image','restaurant_categories'] as const),
){}