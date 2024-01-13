import { Account } from "src/auth/entities/account.schema";
import { DriverDto } from "./driver.dto";
import { DriverProfile } from "../entities/driver_profile.schema";

export interface CreateDriverDto extends DriverDto{
    account: Account;
    profile: DriverProfile;
}
