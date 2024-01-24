import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CustomerDto{
    @ApiProperty({
        description: 'Customer address',
        example: 'số 1 VVN, Linh Chiểu, Thủ Đức, TP.HCM'
    })
    @IsString()
    address: string;

    @ApiProperty()
    @IsString()
    avatar: string;

    @ApiProperty({
        description: 'Customer gender',
        example: true
    })
    @IsBoolean()
    gender: boolean;
}