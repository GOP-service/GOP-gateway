import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Coordinates, CoordinatesSchema } from "src/utils/subschemas/location.schema";

@Schema()
export class DeliveryOrder {
    @Prop({ required: true})
    restaurant_id: string

    @Prop({ required: true})
    delivery_address: string

    @Prop({ required: true, type: CoordinatesSchema})
    delivery_location: Coordinates

    @Prop({ required: true})
    delivery_details: {
        food_id: string,
        food_name: string,
        food_option: string,
        food_option_price: number,
        category_option: string[],
        category_option_price: number[],
        quantity: number,
    }[]
}

export const DeliveryOrderSchema = SchemaFactory.createForClass(DeliveryOrder);