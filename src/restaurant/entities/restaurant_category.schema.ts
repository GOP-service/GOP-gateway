import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { RestaurantFood, RestaurantFoodSchema } from "./restaurant_food.schema";
import { PriceOption, PriceOptionSchema } from "src/utils/subschemas/priceoption.schema";

export type RestaurantCategoryDocument = RestaurantCategory & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class RestaurantCategory {
    constructor(partial: Partial<RestaurantCategory>) {
        Object.assign(this, partial);
    }

    @Prop({ })
    name: string

    @Prop()
    image: string

    @Prop()
    bio: string

    @Prop({ type: [PriceOptionSchema], default: []})
    options: PriceOption[]

    @Prop({ type: [RestaurantFoodSchema] })
    food_items: RestaurantFood[]
}

export const RestaurantCategorySchema = SchemaFactory.createForClass(RestaurantCategory);