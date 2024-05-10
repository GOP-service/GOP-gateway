import { CurrencyCode } from "src/utils/enums"
import { PromotionConditionDto } from "./promotion-condition.dto"
import { PromotionDiscountDto } from "./promotion-discount.dto"
import { PromotionQuotasDto } from "./promotion-quotas.dto"

export class PromotionDto {
    restaurant_id: string
    name: string
    description: string
    quotas: PromotionQuotasDto
    conditions: PromotionConditionDto
    discount: PromotionDiscountDto
    unavailable_users: string[]
    currency_code: CurrencyCode
}