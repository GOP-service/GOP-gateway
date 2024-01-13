import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { RestaurantFoodReview } from "./restaurant_food_review.schema";

@Schema()
export class RestaurantFood {
    @Prop({ required: true})
    name: string

    @Prop({ required: true, default: 'ố deeeeeeeeeee'})
    bio: string

    @Prop()
    image: string

    @Prop()
    options: {
        name: string,
        bio: string,
        price: number
    }[]

    @Prop({ type: [RestaurantFoodReview], _id: true, ref: RestaurantFoodReview.name})
    reviews: RestaurantFoodReview[]
}

export const RestaurantFoodSchema = SchemaFactory.createForClass(RestaurantFood);