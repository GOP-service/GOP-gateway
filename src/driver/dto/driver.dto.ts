import { Account } from "src/auth/entities/account.schema";
import { VehicleType } from "src/utils/enums";
import { DriverProfile } from "../entities/driver_profile.schema";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { LocationObject } from "src/utils/subschemas/location.schema";

export class DriverDto{
    @ApiProperty({
        example: 'Airblade 150'
    })
    @IsNotEmpty()
    @IsString()
    vehicle_model: string;

    @ApiProperty({
        example: '30T4-1945'
    })
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

    @ApiProperty({
        example: new LocationObject([10.850739590040357,106.77195728296408])
    })
    @IsNotEmpty()
    location: LocationObject

    @ApiProperty()
    avatar: string;
}