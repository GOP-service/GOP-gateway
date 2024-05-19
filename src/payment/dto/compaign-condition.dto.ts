import { CampaignUserGroup } from "src/utils/enums"

export class CampaignConditionDto {
    start_time: Date
    end_time: Date
    user_group: CampaignUserGroup
    minBasketGroup: number
}