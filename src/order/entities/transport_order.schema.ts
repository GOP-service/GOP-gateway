import { Schema,Prop, SchemaFactory } from "@nestjs/mongoose"
import { LocationObject } from "src/utils/subschemas/location.schema"
import { OrderType, VehicleType } from "src/utils/enums";
import { Order, OrderDocument } from "./order.schema";

export type TransportOrderType = TransportOrder & Order

@Schema()
export class TransportOrder {

    @Prop({ enum: VehicleType })
    vehicle_type: VehicleType

    @Prop({ })
    pickup_location: LocationObject 

    @Prop({ })
    dropoff_location: LocationObject
    
    @Prop({ })
    distance: number

    @Prop({ })
    duration: number

    @Prop({ })
    trip_fare: number
}

export const TransportOrderSchema = SchemaFactory.createForClass(TransportOrder);