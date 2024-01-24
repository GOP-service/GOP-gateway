import { Account } from "src/auth/entities/account.schema";
import { VehicleType } from "src/utils/enums";
import { DriverProfile } from "../entities/driver_profile.schema";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class DriverDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    vehicle_model: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    vehicle_plate_number: string;

    @ApiProperty({
        enum: VehicleType,
        default: VehicleType.BIKE,
    })
    @IsNotEmpty()
    @IsEnum(VehicleType)
    vehicle_type: VehicleType;

    @ApiProperty()
    avatar: string;
}