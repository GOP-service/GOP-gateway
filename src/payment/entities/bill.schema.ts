import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BillStatus, PaymentMethod } from "src/utils/enums";

export type BillDocument = Bill & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Bill {
    @Prop({ required: true, enum: BillStatus, default: BillStatus.PENDING })
    status: BillStatus

    @Prop({ required: true, enum: PaymentMethod, default: PaymentMethod.CASH })
    payment_method: PaymentMethod

    @Prop({ })
    total: number

    @Prop({ default: 2000 })
    platform_fee: number
}

export const BillSchema = SchemaFactory.createForClass(Bill);