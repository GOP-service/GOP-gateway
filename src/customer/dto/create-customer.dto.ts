import { Account } from "src/auth/entities/account.schema";

export interface CreateCustomerDto {
    account: Account;
    full_name: string;
}
