import { ApiProperty } from "@nestjs/swagger";
import { PromotionDiscountType } from "src/utils/enums";

export class PromotionDiscountDto {
    @ApiProperty({
        example: "DELIVERY"
    })
    type: PromotionDiscountType

    cap: number
    
    value: number
    
    scope: PromotionDiscountDto
}