import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { LocationObject, LocationSchema } from "src/utils/subschemas/location.schema";

export type DeliveryOrderDocument = DeliveryOrder & Document

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

    @Prop({ required: true, type: LocationSchema})
    delivery_location: LocationObject

}

export const DeliveryOrderSchema = SchemaFactory.createForClass(DeliveryOrder);