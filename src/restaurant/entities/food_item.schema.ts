import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { ModifierGroup } from "./modifier_groups.schema";
import { BaseEntity } from "src/utils/repository/base.entity";

export type FoodItemDocument = HydratedDocument<FoodItem>;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class FoodItem extends BaseEntity{
    constructor(name: string, bio: string, price: number, modifier_groups: string[]){
        super();
        this.name = name;
        this.bio = bio;
        this.price = price;
        this.modifier_groups = modifier_groups;
    }

    @Prop({ required: true})
    name: string

    @Prop({ default: 'ố deeeeeeeeeee'})
    bio: string

    @Prop()
    image: string

    @Prop()
    price: number

    @Prop({ type: [SchemaTypes.ObjectId], ref: 'ModifierGroup', default: []})
    modifier_groups: ModifierGroup[] | string[]
}

export const FoodItemSchema = SchemaFactory.createForClass(FoodItem);