import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RestaurantFoodReviewDocument = RestaurantFoodReview & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class RestaurantFoodReview {
    @Prop({ required: true})
    owner_id: string

    @Prop({ required: true})
    content: string

    @Prop({ required: true})
    type: string

    @Prop({ required: true, min: 0, max: 5 })
    rating: number

    @Prop({ required: true})
    reviewable_id: string
}

export const RestaurantFoodReviewSchema = SchemaFactory.createForClass(RestaurantFoodReview);