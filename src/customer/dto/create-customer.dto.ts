import { PartialType } from "@nestjs/swagger";
import { Account } from "src/auth/entities/account.schema";
import { CustomerDto } from "./customer.dto";

export class CreateCustomerDto extends CustomerDto{
    account: Account;
}
