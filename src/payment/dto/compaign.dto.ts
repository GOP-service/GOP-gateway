import { CurrencyCode } from "src/utils/enums"
import { CampaignQuotasDto } from "./compaign-quotas.dto"
import { CampaignConditionDto } from "./compaign-condition.dto"
import { CampaignDiscountDto } from "./compaign-discount.dto"

export class CampaignDto {
    restaurant_id: string
    name: string
    description: string
    quotas: CampaignQuotasDto
    conditions: CampaignConditionDto
    discount: CampaignDiscountDto
    unavailable_users: string[]
    currency_code: CurrencyCode
}