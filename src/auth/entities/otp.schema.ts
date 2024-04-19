import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date, Schema as mongooseSchema } from "mongoose";
import { OTPType } from "src/utils/enums";

export type OtpDocument = Otp & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
    versionKey: false,
})
export class Otp{
    @Prop({ required: true })
    owner_id: string

    @Prop({ required: true, default: String(Date.now()).slice(-6) })
    otp: string

    @Prop({ required: true, enum: OTPType})
    type: OTPType

    @Prop({ trequired: true, default: Date.now()+30*60*1000 }) //** 30 minutes
    expired_at: number
}

export const OtpSchema = SchemaFactory.createForClass(Otp)