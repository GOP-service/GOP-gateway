import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { PromotionScopeType } from "src/utils/enums";

export class PromotionScopeDto {
    @ApiProperty({
        example: "ORDER"
    })
    @IsNotEmpty()
    type: PromotionScopeType

    @ApiProperty({})
    object_ids: number
}