import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, SchemaTypes, Types } from "mongoose";
import { FoodItem } from "./food_item.schema";
import { BaseEntity } from "src/utils/repository/base.entity";

export type RestaurantCategoryDocument = HydratedDocument<RestaurantCategory>;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class RestaurantCategory extends BaseEntity{
    constructor(data: Partial<RestaurantCategory>){
        super();
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