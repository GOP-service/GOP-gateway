import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
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
    min: number

    @ApiProperty({
        example: '1'
    })
    max: number

    @ApiProperty({
        example: 'tu nhap di'
    })
    modifier: ModifierDto[]

}