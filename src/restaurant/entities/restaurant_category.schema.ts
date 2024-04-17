import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { FoodItem } from "./food_item.schema";

export type RestaurantCategoryDocument = RestaurantCategory & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class RestaurantCategory {
    constructor(data: Partial<RestaurantCategory>){
        Object.assign(this, data);
    }

    @Prop({ required: true})
    name: string

    @Prop()
    bio: string

    @Prop([{ type: SchemaTypes.ObjectId, ref: 'FoodItem'}])
    food_items: FoodItem[]
}

export const RestaurantCategorySchema = SchemaFactory.createForClass(RestaurantCategory);