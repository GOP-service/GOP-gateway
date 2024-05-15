import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Schema as MongooseSchema } from "mongoose";
import { FoodItem } from "src/restaurant/entities/food_item.schema";
import { LocationObject, LocationSchema } from "src/utils/subschemas/location.schema";
import { Order } from "./order.schema";
import { OrderFoodItems } from "./order_food_items.schema";
import { OrderType } from "src/utils/enums";
import { Restaurant } from "src/restaurant/entities/restaurant.schema";

export type DeliveryOrderType = DeliveryOrder & Order

@Schema()
export class DeliveryOrder {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Restaurant' })
    restaurant: Restaurant

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