import { Account } from "src/auth/entities/account.schema";
import { RestaurantDto } from "./restaurant.dto";

export class CreateRestaurantDto extends RestaurantDto{
    account: Account;
}
