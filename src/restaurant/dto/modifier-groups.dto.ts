import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { ModifierDto } from "./modifier.dto";

export class ModifierGroupsDto {
    @ApiProperty({
        example: 'say oh yeahhhhhhh'
    })
    @IsString()
    name: string

    @ApiProperty({
        example: '0'
    })
    @IsNumber()
    min: number

    @ApiProperty({
        example: '1'
    })
    @IsNumber()
    max: number

    @ApiProperty({
        example: 'tu nhap di'
    })
    modifier: ModifierDto[]

}