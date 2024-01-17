import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { Role } from "../entities/role.schema";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {
    @ApiProperty({
        example: '0333495017',
    })
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}
