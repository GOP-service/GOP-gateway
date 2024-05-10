import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CurrencyCode} from "src/utils/enums";
import { PromotionCondition } from "./promotion_condition.schema";
import { PromotionDiscount } from "./promotion_discount.shema";
import { PromotionQuotas } from "./promotion_quotas.schema";
export type PromotionDocument = Promotion & Document

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    timestamps: true
})
export class Promotion {

    @Prop({ default: "" })
    restaurant_id: string

    @Prop({ required: true })
    name: string

    @Prop({ default: '' })
    description: string

    @Prop({ required: true })
    conditions: PromotionCondition

    @Prop({ required: true })
    discount: PromotionDiscount

    @Prop({})
    quotas: PromotionQuotas

    @Prop({ default: [] })
    unavailable_users: string[]

    @Prop({ default: CurrencyCode.VND })
    currency_code: CurrencyCode
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion)