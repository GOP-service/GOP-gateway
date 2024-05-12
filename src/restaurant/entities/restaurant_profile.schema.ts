import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseEntity } from "src/utils/repository/base.entity";


export type RestaurantProfileDocument = HydratedDocument<RestaurantProfile>;
@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    _id: false,
    timestamps: true,
})
export class RestaurantProfile extends BaseEntity{
    @Prop({ })
    license_image: string
}

export const RestaurantProfileSchema = SchemaFactory.createForClass(RestaurantProfile);