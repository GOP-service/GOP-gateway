import { Schema,Prop, SchemaFactory } from "@nestjs/mongoose"
import { Coordinates } from "src/utils/subschemas/location.schema"

@Schema()
export class TransportOrder {
    @Prop({ required: true})
    pickup_address: string

    @Prop({ required: true})
    dropoff_address: string

    @Prop({ required: true})
    pickup_location: Coordinates 

    @Prop({ required: true})
    dropoff_location: Coordinates
}

export const TransportOrderSchema = SchemaFactory.createForClass(TransportOrder);1