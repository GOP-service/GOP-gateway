import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CampaignScopeType } from "src/utils/enums";

export class CampaignScopeDto {
    @ApiProperty({
        example: "ORDER"
    })
    @IsNotEmpty()
    type: CampaignScopeType

    @ApiProperty({})
    object_ids: number
}