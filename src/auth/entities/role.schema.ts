import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Role {
    @Prop({ default: '' })
    driver: string;

    @Prop({ default: '' })
    customer: string;

    @Prop({ default: '' })
    restaurant: string;

    @Prop({ default: false })
    admin: boolean;
}

const RoleSchema = SchemaFactory.createForClass(Role);

export { RoleSchema };