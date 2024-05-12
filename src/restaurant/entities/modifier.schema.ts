import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseEntity } from "src/utils/repository/base.entity";

export type ModifierDocument = HydratedDocument<Modifier>

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Modifier extends BaseEntity{
    constructor(name: string, price: number){
        super();
        this.name = name;
        this.price = price;
    }

    @Prop({ required: true})
    name: string

    @Prop({ required: true})
    price: number
}

export const ModifierSchema = SchemaFactory.createForClass(Modifier);