import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, SchemaTypes } from "mongoose";
import { OrderType } from "src/utils/enums";
import { BaseEntity } from "src/utils/repository/base.entity";

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Review extends BaseEntity {
    @Prop({ type: SchemaTypes.ObjectId,  ref: 'Customer' })
    owner_id: string

    @Prop({ })
    content: string

    @Prop({ default: OrderType.DELIVERY })
    type: OrderType

    @Prop({ min: 0, max: 5 })
    rating: number

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Restaurant' })
    reviewable_id: string
}

export const ReviewSchema = SchemaFactory.createForClass(Review);