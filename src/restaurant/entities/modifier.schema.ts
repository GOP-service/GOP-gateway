import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ModifierDocument = Modifier & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Modifier {
    constructor(name: string, price: number){
        this.name = name;
        this.price = price;
    }

    @Prop({ required: true})
    name: string

    @Prop({ required: true})
    price: number
}

export const ModifierSchema = SchemaFactory.createForClass(Modifier);