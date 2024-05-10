import { PromotionUserGroup } from "src/utils/enums"

export class PromotionConditionDto {
    start_time: Date
    end_time: Date
    user_group: PromotionUserGroup
    minBasketGroup: number
}