import { Schema,Prop, SchemaFactory } from "@nestjs/mongoose"
import { LocationObject } from "src/utils/subschemas/location.schema"
import { VehicleType } from "src/utils/enums";
import { OrderDocument } from "./order.schema";

export type TransportOrderDocument = TransportOrder & OrderDocument

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    _id: false,
    id: false,
})
export class TransportOrder {
    order_type: string

    @Prop({ required: true, enum: VehicleType })
    vehicle_type: VehicleType

    @Prop({ required: true})
    pickup_location: LocationObject 

    @Prop({ required: true})
    pickup_address: string

    @Prop({ required: true})
    dropoff_location: LocationObject

    @Prop({ required: true})
    dropoff_address: string
    
    @Prop({ required: true})
    distance: number

    @Prop({ required: true})
    duration: number

    @Prop({ required: true})
    trip_fare: number
}

export const TransportOrderSchema = SchemaFactory.createForClass(TransportOrder);