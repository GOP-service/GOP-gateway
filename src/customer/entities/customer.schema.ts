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
    @Prop({ default: 'số 1 VVN, Linh Chiểu, Thủ Đức, TP.HCM' })
    address: string

    @Prop({ default: true })
    gender: boolean //* male: true

    @Prop({ default: 'https://gopstorage0.blob.core.windows.net/appicon/default_avt.jpg' })
    avatar: string
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
