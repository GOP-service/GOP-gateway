
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class DriverProfile {
    
}

export const DriverProfileSchema = SchemaFactory.createForClass(DriverProfile);