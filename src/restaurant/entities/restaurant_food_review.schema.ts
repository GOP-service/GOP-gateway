import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import { BaseEntity } from "src/utils/repository/base.entity";

export type RestaurantFoodReviewDocument = HydratedDocument<RestaurantFoodReview>;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class RestaurantFoodReview extends BaseEntity {
    @Prop({ })
    owner_id: string

    @Prop({ })
    content: string

    @Prop({ })
    type: string

    @Prop({ min: 0, max: 5 })
    rating: number

    @Prop({ })
    reviewable_id: string
}

export const RestaurantFoodReviewSchema = SchemaFactory.createForClass(RestaurantFoodReview);