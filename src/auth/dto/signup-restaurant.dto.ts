import { IntersectionType } from "@nestjs/swagger";
import { SigninDto } from "./signin.dto";
import { RestaurantDto } from "src/restaurant/dto/restaurant.dto";

export class SignupRestaurantDto extends IntersectionType(
    SigninDto,
    RestaurantDto
){}