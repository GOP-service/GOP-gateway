import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Coordinates, CoordinatesSchema } from "src/utils/subschemas/location.schema";
import { RoleType } from "src/utils/enums";
import { Role, RoleSchema } from "./role.schema";

export type AccountDocument = Account & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Account {
    @Prop({ unique: true, sparse: true })
    phone: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true, select: false })
    password: string

    @Prop({ required: true })
    full_name: string

    @Prop({ type: RoleSchema , default: new Role()})
    role: Role

    @Prop()
    refreshToken: string

    @Prop({ type: CoordinatesSchema, default: new Coordinates() })
    location: Coordinates

    @Prop({ default: false })
    verified: boolean

}


const AccountSchema = SchemaFactory.createForClass(Account)



export { AccountSchema };
