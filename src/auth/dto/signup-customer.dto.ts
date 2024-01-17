import { IntersectionType, PickType } from "@nestjs/swagger";
import { CustomerDto } from "src/customer/dto/customer.dto";
import { CreateAccountDto } from "./create-acc.dto";

export class SignupCustomerDto extends IntersectionType(
    CreateAccountDto,
    PickType(CustomerDto, ['full_name'] as const),
){}