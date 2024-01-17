import { Account } from "src/auth/entities/account.schema";
import { DriverDto } from "./driver.dto";
import { DriverProfile } from "../entities/driver_profile.schema";
import { OmitType } from "@nestjs/swagger";

export class CreateDriverDto extends OmitType(DriverDto, ['avatar'] as const){
    profile: DriverProfile;
}
