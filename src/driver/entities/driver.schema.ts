import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { DriverStatus, VehicleType } from "src/utils/enums";
import { Rating, RatingSchema } from "src/utils/subschemas/rating.schema";
import { DriverProfile, DriverProfileSchema } from "./driver_profile.schema";

export type DriverDocument = Driver & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Driver {
    @Prop({ required: true })
    full_name: string
    
    @Prop({ enum: VehicleType, default: VehicleType.BIKE })
    vehicle_type: VehicleType

    @Prop({ required: true })
    vehicle_model: string

    @Prop({ required: true })
    vehicle_plate_number: string

    @Prop({ enum: DriverStatus, default: DriverStatus.UNAVAILABLE })
    status: DriverStatus

    @Prop({ type: RatingSchema, default: new Rating()})
    rating: Rating
    
    @Prop({ type: DriverProfileSchema})
    profile: DriverProfile

    @Prop({ })
    avatar: string
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
