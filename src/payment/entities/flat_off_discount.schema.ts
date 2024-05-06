import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    _id: false,
    timestamps: false
})
export class FlatOffDiscount {
    constructor(
        min_spend: number,
        discount_value: number
    ){
        this.min_spend = min_spend,
        this.discount_value = discount_value
    }

    @Prop({})
    min_spend: number

    @Prop({})
    discount_value: number
}

export const FlatOffDiscountSchema = SchemaFactory.createForClass(FlatOffDiscount)