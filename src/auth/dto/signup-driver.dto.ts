import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { VehicleType } from "src/utils/enums";

export class SignupDriverDto {
    @ApiProperty()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    full_name: string;

    @ApiProperty()
    @IsNotEmpty()
    vehicle_model: string;

    @ApiProperty()
    @IsNotEmpty()
    vehicle_plate_number: string;

    @ApiProperty({
        enum: VehicleType,
        default: VehicleType.BIKE,
    })
    @IsNotEmpty()
    @IsEnum(VehicleType)
    vehicle_type: VehicleType;
}