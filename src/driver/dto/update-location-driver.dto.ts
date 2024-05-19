import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { LocationObject } from "src/utils/subschemas/location.schema";

export class UpdateLocationDriverDto {
    @ApiProperty()
    @IsNotEmpty()
    driver: string;

    @ApiProperty()
    @IsNotEmpty()
    location: LocationObject;
}