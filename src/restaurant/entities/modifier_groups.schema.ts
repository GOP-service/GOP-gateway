import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Modifier, ModifierSchema } from "./modifier.schema";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { BaseEntity } from "src/utils/repository/base.entity";

export type ModifierGroupDocument = HydratedDocument<ModifierGroup>;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class ModifierGroup extends BaseEntity{
    constructor( name: string, modifier: string[], min?: number, max?: number){
        super();
        this.name = name;
        this.modifier = modifier;
        this.min = min;
        this.max = max;
    }

    @Prop({ required: true})
    name: string

    @Prop({ required: true, type: [SchemaTypes.ObjectId], ref: 'Modifier', default: []})
    modifier: Modifier[] | string[]

    @Prop({ required: true, default: 0})
    min: number

    @Prop({})
    max: number
}

export const ModifierGroupSchema = SchemaFactory.createForClass(ModifierGroup);