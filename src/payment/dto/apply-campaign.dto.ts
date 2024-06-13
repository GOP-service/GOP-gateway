import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ApplyCampaignDto {
    @ApiProperty({
        example: ['1', '2']
    })
    @IsNotEmpty()
    compaign_ids: string[]

    @ApiProperty({
        example: 200000
    })
    @IsNotEmpty()
    subtotal: number

    @ApiProperty({
        example: 12000
    })
    delivery_fare: number

    constructor(){}
}