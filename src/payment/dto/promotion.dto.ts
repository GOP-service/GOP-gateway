import { PromotionOrderType, PromotionState, PromotionType, PromotionUserGroup } from "src/utils/enums"
import { FlatOffDiscount } from "../entities/flat_off_discount.schema"
export class PromotionDto {
    start_time: Date
    end_time: Date
    user_group: PromotionUserGroup
    promo_type: PromotionType
    promo_order_type: PromotionOrderType
    flat_off_discount: FlatOffDiscount
}