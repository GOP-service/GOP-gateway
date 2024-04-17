import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Modifier, ModifierSchema } from "./modifier.schema";
import { SchemaTypes, Types } from "mongoose";

export type ModifierGroupDocument = ModifierGroup & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class ModifierGroup {
    constructor( name: string, modifier: Modifier[], min?: number, max?: number){
        this.name = name;
        this.modifier = modifier;
        this.min = min;
        this.max = max;
    }

    @Prop({ required: true})
    name: string

    @Prop({ required: true, type: [SchemaTypes.ObjectId], ref: 'Modifier'})
    modifier: Modifier[]

    @Prop({ required: true, default: 0})
    min: number

    @Prop({})
    max: number
}

export const ModifierGroupSchema = SchemaFactory.createForClass(ModifierGroup);