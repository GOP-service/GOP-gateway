import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PromotionScopeType } from "src/utils/enums";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    _id: false,
    timestamps: false
})
export class PromotionScope {
    @Prop({ required: true })
    type: PromotionScopeType

    @Prop()
    object_ids: string[]
}
export const PromotionScopeSchema = SchemaFactory.createForClass(PromotionScope)