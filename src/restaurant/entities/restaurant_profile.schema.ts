import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class RestaurantProfile {
    
}

export const RestaurantProfileSchema = SchemaFactory.createForClass(RestaurantProfile);