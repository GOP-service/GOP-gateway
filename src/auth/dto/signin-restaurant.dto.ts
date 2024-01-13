import { IsNotEmpty } from "class-validator";

export class SigninRestaurantDto {
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    password: string;
}