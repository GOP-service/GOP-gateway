import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    _id: false,
    timestamps: true,
})
export class RestaurantProfile {
    @Prop({ })
    license_image: string
}

export const RestaurantProfileSchema = SchemaFactory.createForClass(RestaurantProfile);