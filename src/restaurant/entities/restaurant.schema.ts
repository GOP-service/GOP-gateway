import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, SchemaTypes } from "mongoose";
import { CuisinesCategory, RestaurantStatus, RestaurantTier } from "src/utils/enums";
import { RestaurantProfile, RestaurantProfileSchema } from "./restaurant_profile.schema";
import { Rating, RatingSchema } from "src/utils/subschemas/rating.schema";
import { LocationObject } from "src/utils/subschemas/location.schema";
import { RestaurantCategory, RestaurantCategorySchema } from "./restaurant_category.schema";
import { Account } from "src/auth/entities/account.schema";

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Restaurant extends Account{
    @Prop({ enum: CuisinesCategory , type: [String]})
    cuisine_categories: CuisinesCategory[]

    @Prop([{ type: SchemaTypes.ObjectId, ref: 'RestaurantCategory'}])
    restaurant_categories: string[]

    @Prop({ enum: RestaurantStatus, default: RestaurantStatus.CLOSED })
    status: RestaurantStatus

    @Prop({ required: true })
    restaurant_name: string

    @Prop({  })
    location: LocationObject

    @Prop({ required: true })
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