import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CurrencyCode} from "src/utils/enums";
import { BaseEntity } from "src/utils/repository/base.entity";
import { CampaignCondition } from "./campaign_condition.schema";
import { CampaignDiscount } from "./campaign_discount.shema";
import { CampaignQuotas } from "./campaign_quotas.schema";
export type CampaignDocument = Campaign & Document

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    timestamps: true
})
export class Campaign extends BaseEntity{

    @Prop({ default: null })
    restaurant_id: string

    @Prop({ required: true })
    name: string

    @Prop({ default: '' })
    description: string

    @Prop({ required: true })
    conditions: CampaignCondition

    @Prop({ required: true })
    discount: CampaignDiscount

    @Prop({})
    quotas: CampaignQuotas

    @Prop({ default: [] })
    unavailable_users: string[]

    @Prop({ default: CurrencyCode.VND })
    currency_code: CurrencyCode

    @Prop({ default: 'https://media.be.com.vn/bizops/image/aacff7f7-52cd-11ee-b2af-3ea2e1c5510b/original' })
    image: string
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign)