import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Modifier } from "src/restaurant/entities/modifier.schema";


export type OrderFoodItemsDocument = OrderFoodItems & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class OrderFoodItems {
    @Prop({ required: true})
    id: string

    @Prop({ required: true})
    name: string

    @Prop({ required: true, default: 'ố deeeeeeeeeee'})
    quantity: number

    @Prop()
    price: number

    @Prop({ type: [SchemaTypes.ObjectId], ref: 'Modifier'})
    modifiers: Modifier[]

    @Prop()
    specifications: string
}

export const FoodItemsSchema = SchemaFactory.createForClass(OrderFoodItems);