import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { FoodItem } from "src/restaurant/entities/food_item.schema";
import { LocationObject, LocationSchema } from "src/utils/subschemas/location.schema";
import { OrderDocument } from "./order.schema";
import { OrderFoodItems } from "./order_food_items.schema";

export type DeliveryOrderDocument = DeliveryOrder & OrderDocument

@Schema()
export class DeliveryOrder {

    @Prop({ })
    restaurant_id: string

    @Prop() //{type: [SchemaTypes.ObjectId], ref: 'OrderFoodItems'}
    items: OrderFoodItems[]

    @Prop({ type: LocationSchema})
    delivery_location: LocationObject

    @Prop({ })
    delivery_address: string

    @Prop({ })
    distance: number

    @Prop({ })
    duration: number

    @Prop({  })
    delivery_fare: number

    @Prop({ })
    order_cost: number  
}

export const DeliveryOrderSchema = SchemaFactory.createForClass(DeliveryOrder);