import { Account } from "src/auth/entities/account.schema";
import { VehicleType } from "src/utils/enums";
import { DriverProfile } from "../entities/driver_profile.schema";

export interface CreateDriverDto {
    account: Account;

    full_name: string;

    vehicle_type: VehicleType;

    vehicle_model: string;

    vehicle_plate_number: string;

    profile: DriverProfile;
}
