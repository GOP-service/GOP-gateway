import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Account } from "src/auth/entities/account.schema";

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

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Account.name, required: true })
    account: Account
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
