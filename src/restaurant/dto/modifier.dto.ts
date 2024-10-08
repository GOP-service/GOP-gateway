import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ModifierDto {
    _id?: string

    @ApiProperty({
        example: 'modifier'
    })
    @IsString()
    name: string

    @ApiProperty({
        example: '12000'
    })
    @IsNotEmpty()
    price: number
}