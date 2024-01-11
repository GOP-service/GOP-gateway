import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { OrderStatus, OrderType } from "src/utils/enums";
import { DeliveryOrder } from "./delivery_order.schema";
import { TransportOrder } from "./transport_order.schema";
import { Bill, BillSchema } from "src/bill/entities/bill.schema";

export type OrderDocument = Order & Document;

type OrderDetails = DeliveryOrder | TransportOrder

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Order {
    @Prop({ required: true})
    customer_id: string

    @Prop({ required: true})
    driver_id: string

    @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus

    @Prop({ enum: OrderType, required: true })
    type: OrderType

    @Prop({ required: true, type: Object})
    details: OrderDetails

    @Prop({ type: BillSchema, ref: Bill.name })
    bill: Bill

    @Prop({ required: true})
    distance: number

    @Prop({ required: true})
    duration: number

    @Prop({ required: true})
    sub_total: number
}

export const OrderSchema = SchemaFactory.createForClass(Order);