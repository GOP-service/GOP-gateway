import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Order, OrderSchema } from "src/order/entities/order.schema";

export type LedgerDocument = Ledger & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Ledger {
    @Prop({ required: true })
    owner_id: string

    @Prop({ type: [OrderSchema], default: [],ref: 'Order'})
    orders: Order[]

    @Prop()
    total: number

    @Prop({ default: false })
    closed: boolean
}

export const LedgerSchema = SchemaFactory.createForClass(Ledger);