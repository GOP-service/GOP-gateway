import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, SchemaTypes } from "mongoose";
import { OrderType, OrderStatus, VehicleType } from "src/utils/enums";
import { Bill, BillSchema } from "src/payment/entities/bill.schema";
import { BaseEntity } from "src/utils/repository/base.entity";
import { LocationObject, LocationSchema } from "src/utils/subschemas/location.schema";
import { OrderFoodItems } from "./order_food_items.schema";
import { DeliveryOrder,  DeliveryOrderSchema, DeliveryOrderType } from "./delivery_order.schema";
import { TransportOrder, TransportOrderSchema, TransportOrderType } from "./transport_order.schema";
import { Driver } from "src/driver/entities/driver.schema";
import { Customer } from "src/customer/entities/customer.schema";

export type OrderDocument = HydratedDocument<Order>

export type OrderDetails = Order & TransportOrder & DeliveryOrder

export type OrderDetailsType = TransportOrderType | DeliveryOrderType   

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
    discriminatorKey: 'order_type',
})
export class Order extends BaseEntity{
    @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer'})
    customer: Customer

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver'})
    driver: Driver

    @Prop({ enum: OrderStatus, type: String})
    order_status: OrderStatus

    @Prop({ type: Date })
    order_time: Date

    @Prop({ type: Date })
    submit_time: Date

    @Prop({ type: Date })
    complete_time: Date

    @Prop({ enum: OrderType, type: String, 
        discriminators: [ 
            { name: DeliveryOrder.name, schema: DeliveryOrderSchema }, 
            { name: TransportOrder.name, schema: TransportOrderSchema } 
        ]})
    order_type: OrderType

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Bill' })
    bill: Bill

    @Prop({})
    cancel_reason: string

    @Prop({default: []})
    drivers_reject: string[]
}

export const OrderSchema = SchemaFactory.createForClass(Order);