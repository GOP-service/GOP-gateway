import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { RestaurantFood, RestaurantFoodSchema } from "./restaurant_food.schema";

export type RestaurantCategoryDocument = RestaurantCategory & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class RestaurantCategory {
    @Prop({ required: true, unique: true })
    _id: string

    @Prop({ required: true})
    name: string

    @Prop()
    image: string

    @Prop()
    bio: string

    @Prop()
    options: {
        name: string,
        bio: string,
        price: number
    }[]

    @Prop({ type: RestaurantFoodSchema, _id: true, ref: RestaurantFood.name })
    food_items: RestaurantFood[]
}

export const RestaurantCategorySchema = SchemaFactory.createForClass(RestaurantCategory);