import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CustomerDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    full_name: string;

    @ApiProperty()
    @IsString()
    address: string;
}