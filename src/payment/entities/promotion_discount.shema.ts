import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PromotionDiscountType } from "src/utils/enums";
import { PromotionScope } from "./promotion_scope.schema";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    _id: false,
    timestamps: false
})
export class PromotionDiscount {
    @Prop({ require: true })
    type: PromotionDiscountType

    @Prop()
    cap: number

    @Prop({ required: true })
    value: number

    @Prop({ required: true })
    scope: PromotionScope
}

export const PromotionDiscountSchema = SchemaFactory.createForClass(PromotionDiscount)