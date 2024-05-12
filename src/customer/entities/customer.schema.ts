import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Account } from "src/auth/entities/account.schema";

export type CustomerDocument = HydratedDocument<Customer>

@Schema()
export class Customer extends Account{

    @Prop({ default: 'số 1 VVN, Linh Chiểu, Thủ Đức, TP.HCM' })
    address: string

    @Prop({ default: true })
    gender: boolean //* male: true

    @Prop({ default: 'https://gopstorage0.blob.core.windows.net/appicon/default_avt.jpg' })
    avatar: string
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
