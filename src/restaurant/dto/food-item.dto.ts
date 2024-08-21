import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ModifierGroup } from "../entities/modifier_groups.schema";
import { ModifierGroupsDto } from "./modifier-groups.dto";

export class FoodItemDto {
    _id?: string
    
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
    modifier_groups: ModifierGroupsDto[] | string[];
}