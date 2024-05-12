import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { CuisinesCategory, RestaurantStatus, RestaurantTier } from "src/utils/enums";
import { RestaurantProfile, RestaurantProfileSchema } from "./restaurant_profile.schema";
import { Rating, RatingSchema } from "src/utils/subschemas/rating.schema";
import { LocationObject } from "src/utils/subschemas/location.schema";
import { RestaurantCategory, RestaurantCategorySchema } from "./restaurant_category.schema";

export type RestaurantDocument = Restaurant & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Restaurant {
    @Prop({ enum: CuisinesCategory , type: [String], default: []})
    cuisine_categories: CuisinesCategory[]

    @Prop([{ type: SchemaTypes.ObjectId, ref: 'RestaurantCategory'}])
    restaurant_categories: RestaurantCategory[]

    @Prop({ enum: RestaurantStatus, default: RestaurantStatus.CLOSED })
    status: RestaurantStatus

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    location: LocationObject

    @Prop({ required: true , default: 'say oh yeahhhhhhh'})
    bio: string

    @Prop({  })
    avatar: string
    
    @Prop({  })
    cover_image: string

    @Prop({ enum: RestaurantTier, default: RestaurantTier.STANDARD})
    tier: RestaurantTier    

    @Prop({ type: RestaurantProfileSchema, default: new RestaurantProfile(), select: false})
    profile: RestaurantProfile

}


export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);