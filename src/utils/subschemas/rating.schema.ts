import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class Rating {
    @Prop({ default: 0 })
    rating_scores: number

    @Prop({ default: 0 })
    rating_count: number

    @Prop({ default: 0 })
    compliment_1: number

    @Prop({ default: 0 })
    compliment_2: number

    @Prop({ default: 0 })
    compliment_3: number

    @Prop({ default: 0 })
    compliment_4: number
}

export const RatingSchema = SchemaFactory.createForClass(Rating);