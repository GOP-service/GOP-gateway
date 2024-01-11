import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class RestaurantFood {
    @Prop({ required: true})
    name: string

    @Prop({ required: true, default: 'ố deeeeeeeeeee'})
    bio: string

    @Prop()
    image: string

    @Prop()
    options: {
        name: string,
        bio: string,
        price: number
    }[]

    @Prop()
    reviews: {}
}

export const RestaurantFoodSchema = SchemaFactory.createForClass(RestaurantFood);