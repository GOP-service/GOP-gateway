import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Account, AccountSchema } from "src/auth/entities/account.schema";

export type CustomerDocument = Customer & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Customer {
    @Prop({ required: true })
    full_name: string

    @Prop()
    address: string

    @Prop()
    avatar: string
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
