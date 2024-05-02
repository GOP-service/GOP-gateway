import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { ModifierGroup } from "./modifier_groups.schema";

export type FoodItemDocument = FoodItem & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class FoodItem {
    constructor(name: string, bio: string, price: number, modifier_groups: ModifierGroup[]){
        this.name = name;
        this.bio = bio;
        this.price = price;
        this.modifier_groups = modifier_groups;
    }

    @Prop({ required: true})
    name: string

    @Prop({ required: true, default: 'ố deeeeeeeeeee'})
    bio: string

    @Prop()
    image: string

    @Prop()
    price: number

    @Prop({ type: [SchemaTypes.ObjectId], ref: 'ModifierGroup'})
    modifier_groups: ModifierGroup[]
}

export const FoodItemSchema = SchemaFactory.createForClass(FoodItem);