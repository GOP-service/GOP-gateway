
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class DriverProfile {
    @Prop({ })
    vehicle_image: string;
}

export const DriverProfileSchema = SchemaFactory.createForClass(DriverProfile);