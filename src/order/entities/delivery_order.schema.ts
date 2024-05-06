import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { FoodItem } from "src/restaurant/entities/food_item.schema";
import { LocationObject, LocationSchema } from "src/utils/subschemas/location.schema";
import { OrderDocument } from "./order.schema";
import { OrderFoodItems } from "./order_food_items.schema";

export type DeliveryOrderDocument = DeliveryOrder & OrderDocument

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    _id: false,
    id: false,
})
export class DeliveryOrder {
    order_type: string

    @Prop({ required: true})
    restaurant_id: string

    @Prop() //{type: [SchemaTypes.ObjectId], ref: 'OrderFoodItems'}
    items: OrderFoodItems[]

    @Prop({ required: true, type: LocationSchema})
    delivery_location: LocationObject

    @Prop({ required: true})
    delivery_address: string

    @Prop({ required: true})
    distance: number

    @Prop({ required: true})
    duration: number

    @Prop({ required: true })
    delivery_fare: number

    

}

export const DeliveryOrderSchema = SchemaFactory.createForClass(DeliveryOrder);