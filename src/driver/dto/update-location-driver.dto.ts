import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { OrderStatus } from "src/utils/enums";
import { LocationObject } from "src/utils/subschemas/location.schema";

export class UpdateLocationDriverDto {
    @ApiProperty()
    @IsNotEmpty()
    driver: string;

    @ApiProperty()
    @IsNotEmpty()
    location: LocationObject;

    @ApiProperty()
    order_id?: string;

    @ApiProperty()
    order_status?: OrderStatus;
}