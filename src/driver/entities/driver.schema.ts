import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { DriverStatus, VehicleType } from "src/utils/enums";
import { Rating, RatingSchema } from "src/utils/subschemas/rating.schema";
import { DriverProfile, DriverProfileSchema } from "./driver_profile.schema";
import { Account, AccountSchema } from "src/auth/entities/account.schema";
import { LocationObject } from "src/utils/subschemas/location.schema";

export type DriverDocument = Driver & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Driver {  
    @Prop({ enum: VehicleType, default: VehicleType.BIKE, type: String})
    vehicle_type: VehicleType

    @Prop({ required: true })
    vehicle_model: string

    @Prop({ required: true })
    vehicle_plate_number: string

    @Prop({ enum: DriverStatus, default: DriverStatus.OFFLINE, type: String})
    status: DriverStatus

    @Prop({ required : true , type: LocationObject, index: '2dsphere'})
    location: LocationObject

    // @Prop({ type: RatingSchema, default: new Rating()})
    // rating: Rating
    
    @Prop({ type: DriverProfileSchema, default: new DriverProfile(), select: false})
    profile: DriverProfile

    @Prop({ })
    avatar: string
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
