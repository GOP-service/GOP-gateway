import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {
    @ApiProperty({
        example: 'phcnguyenba@gmail.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        example: 'Nguyễn Bá Phước',
    })
    @IsNotEmpty()
    @IsString()
    full_name: string;
}
