import { ApiProperty, IntersectionType, OmitType, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { SigninDto } from "./signin.dto";
import { CustomerDto } from "src/customer/dto/customer.dto";

export class SignupCustomerDto extends IntersectionType(
    SigninDto,
    CustomerDto
){}