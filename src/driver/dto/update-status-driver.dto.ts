import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { DriverStatus } from "src/utils/enums";

export class UpdateStatusDriverDto {
    @ApiProperty({
        enum: DriverStatus,
    })
    @IsNotEmpty()
    status: DriverStatus;
}