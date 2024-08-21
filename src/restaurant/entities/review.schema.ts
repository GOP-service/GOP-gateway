import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { SchemaTypes, Types } from "mongoose"

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Review{
    @Prop({ type: Types.ObjectId, ref: 'Customer' })
    owner_id: Types.ObjectId

    @Prop({ })
    content: string

    @Prop({ min: 0, max: 5 })
    rating: number

    createdAt: Date
}

export const ReviewSchema = SchemaFactory.createForClass(Review)