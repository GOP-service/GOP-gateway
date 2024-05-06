import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { OrderType, OrderStatus } from "src/utils/enums";
import { DeliveryOrder,DeliveryOrderSchema } from "./delivery_order.schema";
import { TransportOrder,TransportOrderSchema } from "./transport_order.schema";
import { Bill, BillSchema } from "src/payment/entities/bill.schema";

export type OrderDocument = Order & Document;

type OrderDetails = DeliveryOrder | TransportOrder

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
    discriminatorKey: 'order_type',
})
export class Order {
    @Prop({})
    customer_id: string

    @Prop({})
    driver_id: string

    @Prop({ enum: OrderStatus, required: true, type: String})
    order_status: OrderStatus

    @Prop({ required: true, type: Date })
    order_time: Date

    @Prop({ type: Date })
    submit_time: Date

    @Prop({ type: Date })
    complete_time: Date

    @Prop({ enum: OrderType, required: true, type: String, 
        discriminators: [ 
            { name: DeliveryOrder.name, schema: DeliveryOrderSchema }, 
            { name: TransportOrder.name, schema: TransportOrderSchema } 
        ]})
    order_type: OrderType

    @Prop({ type: BillSchema, ref: Bill.name })
    bill: Bill

    @Prop({ })
    sub_total: number
}

export const OrderSchema = SchemaFactory.createForClass(Order);