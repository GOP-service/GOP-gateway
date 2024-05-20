import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Modifier } from "src/restaurant/entities/modifier.schema";


@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
    id: false,
    _id: false,
})
export class OrderFoodItems {
    constructor(food_id: string, quantity: number, modifiers: string[]){
        this.food_id = food_id,
        this.quantity = quantity,
        this.modifiers = modifiers
    }
    @Prop({ })
    food_id: string

    @Prop({ default: 'ố deeeeeeeeeee'})
    quantity: number

    @Prop()
    price: number

    @Prop({ type: [SchemaTypes.ObjectId], ref: 'Modifier'})
    modifiers: Modifier[] | string[]


}

