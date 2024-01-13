import { Account } from "src/auth/entities/account.schema";
import { VehicleType } from "src/utils/enums";
import { DriverProfile } from "../entities/driver_profile.schema";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class DriverDto{
    @ApiProperty()
    full_name: string;

    @ApiProperty()
    vehicle_model: string;

    @ApiProperty()
    vehicle_plate_number: string;

    @ApiProperty({
        enum: VehicleType,
        default: VehicleType.BIKE,
    })
    @IsEnum(VehicleType)
    vehicle_type: VehicleType;
}