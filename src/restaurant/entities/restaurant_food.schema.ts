import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { RestaurantFoodReview, RestaurantFoodReviewSchema } from "./restaurant_food_review.schema";
import { PriceOption, PriceOptionSchema } from "src/utils/subschemas/priceoption.schema";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class RestaurantFood {
    constructor(name = '', bio = '', options = []){
        this.name = name;
        this.bio = bio;
        this.options = options;
    }

    @Prop({ required: true})
    name: string

    @Prop({ required: true, default: 'ố deeeeeeeeeee'})
    bio: string

    @Prop()
    image: string

    @Prop({ type: [PriceOptionSchema], default: []})
    options: PriceOption[]

    @Prop({ type: [RestaurantFoodReviewSchema], ref: RestaurantFoodReview.name, default: []})
    reviews: RestaurantFoodReview[]
}

export const RestaurantFoodSchema = SchemaFactory.createForClass(RestaurantFood);