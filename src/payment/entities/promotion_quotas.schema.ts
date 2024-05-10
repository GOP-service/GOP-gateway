import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    _id: false,
    timestamps: false
})
export class PromotionQuotas {
    @Prop()
    limit: number

    @Prop()
    total_count_per_count: number
}

export const PromotionQuotasSchema = SchemaFactory.createForClass(PromotionQuotas)