import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FlatOffDiscount } from "./flat_off_discount.schema";
import { PromotionOrderType, PromotionState, PromotionType, PromotionUserGroup } from "src/utils/enums";
import { SchemaTypes } from "mongoose";
export type PromotionDocument = Promotion & Document

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    timestamps: true
})
export class Promotion {

    @Prop({ required: true })
    name: string

    @Prop({ default: '' })
    description: string

    @Prop({})
    start_time: Date

    @Prop({})
    end_time: Date

    @Prop({ required: true, enum: PromotionUserGroup, default: PromotionUserGroup.ALL_CUSTOMER })
    user_group: PromotionUserGroup

    @Prop({ required: true, enum: PromotionType, default: PromotionType.FLATOFF })
    promo_type: PromotionType

    @Prop({ required: true, enum: PromotionOrderType, default: PromotionOrderType.DELIVERY })
    promo_order_type: PromotionOrderType

    @Prop({})
    flat_off_discount: FlatOffDiscount

    @Prop({ default: [] })
    unavailable_users: string[]

    @Prop({ required: true, default: 100 })
    limit: number
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion)