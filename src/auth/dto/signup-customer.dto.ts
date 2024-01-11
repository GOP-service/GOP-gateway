import { IsNotEmpty } from "class-validator";

export class SignupCustomerDto {
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    full_name: string;
}