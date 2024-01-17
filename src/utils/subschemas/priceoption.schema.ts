import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    _id: false,
    timestamps: true,
})
export class PriceOption {
    constructor(name = '',bio = '',price = 0){
        this.name = name;
        this.bio = bio;
        this.price = price;
    }   

    @Prop({})
    name: string

    @Prop({})
    bio: string
    
    @Prop({})
    price: number
}

export const PriceOptionSchema = SchemaFactory.createForClass(PriceOption);