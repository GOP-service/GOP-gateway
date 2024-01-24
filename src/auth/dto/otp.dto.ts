import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, Length } from "class-validator";

export class OtpDto {
    @ApiProperty({
        description: 'OTP code',
        example: '123456'
    })
    @IsNotEmpty()
    @IsNumberString()
    @Length(6, 6)
    otp: string
}