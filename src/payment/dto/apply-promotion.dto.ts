import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ApplyPromotionDto {
    @ApiProperty({
        example: ['1', '2']
    })
    @IsNotEmpty()
    list_promotion_id: string[]

    @ApiProperty({
        example: 200000
    })
    @IsNotEmpty()
    order_total: number

    @ApiProperty({
        example: 12000
    })
    @IsNotEmpty()
    delivery_fare: number
}