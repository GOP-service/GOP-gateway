import { PartialType, PickType } from "@nestjs/swagger";
import { Account } from "src/auth/entities/account.schema";
import { CustomerDto } from "./customer.dto";

export class CreateCustomerDto extends PickType(CustomerDto,['full_name'] as const) {
    account: Account;
}
