import { ApiProperty } from "@nestjs/swagger";
import { ModifierGroupsDto } from "./modifier-groups.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FoodItemDto {
    @ApiProperty({
        example: 'say oh yeahhhhhhh'
    })
    @IsString()
    name: string

    @ApiProperty({
        example: 'this is mo ta'
    })
    @IsString()
    bio: string

    @ApiProperty({
        example: ''
    })
    image: string

    @ApiProperty({
        example: '20000'
    })
    @IsNotEmpty()
    price: number

    @ApiProperty({
        example: 'tu nhap di'
    })
    @IsOptional()
    modifier_groups: ModifierGroupsDto[];
}