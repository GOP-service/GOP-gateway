import { ApiProperty } from "@nestjs/swagger";
import { CampaignDiscountType } from "src/utils/enums";
import { CampaignScopeDto } from "./compaign-scope.dto";

export class CampaignDiscountDto {
    @ApiProperty({
        example: "DELIVERY"
    })
    type: CampaignDiscountType

    cap: number
    
    value: number
    
    scope: CampaignScopeDto
}