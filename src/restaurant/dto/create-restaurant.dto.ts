import { Account } from "src/auth/entities/account.schema";
import { RestaurantDto } from "./restaurant.dto";
import { OmitType } from "@nestjs/swagger";
import { RestaurantProfile } from "../entities/restaurant_profile.schema";

export class CreateRestaurantDto extends OmitType(RestaurantDto, ['avatar','cover_image','restaurant_categories','location'] as const){
    profile: RestaurantProfile;
}
