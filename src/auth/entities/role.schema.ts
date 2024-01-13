import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ 
    toJSON: {
        getters: true,
        virtuals: true,
    },
    _id: false,
    timestamps: false,
})
export class Role {
    @Prop({ default: '' })
    customer: string;

    @Prop({ default: '' })
    driver: string;

    @Prop({ default: '' })
    restaurant: string;

    @Prop({ default: false })
    admin: boolean;
}

const RoleSchema = SchemaFactory.createForClass(Role);

export { RoleSchema };