
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseEntity } from "src/utils/repository/base.entity";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class CuisineCategories extends BaseEntity {
    @Prop({ required: true })
    name: string
    
    @Prop({ default: '' })
    image: string

    @Prop({ required: true })
    slug: string
}

export const CuisineCategoriesSchema = SchemaFactory.createForClass(CuisineCategories);
