import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, SchemaTypes } from "mongoose";
import { OrderType } from "src/utils/enums";
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
    @Prop({ type: SchemaTypes.ObjectId })
    owner_id: string

    @Prop({ })
    content: string

    @Prop({ default: OrderType.DELIVERY })
    type: OrderType

    @Prop({ min: 0, max: 5 })
    rating: number

    @Prop({ type: SchemaTypes.ObjectId })
    reviewable_id: string
}

export const RestaurantFoodReviewSchema = SchemaFactory.createForClass(RestaurantFoodReview);