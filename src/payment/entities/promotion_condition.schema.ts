import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PromotionUserGroup } from "src/utils/enums";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    _id: false,
    timestamps: false
})
export class PromotionCondition {
    @Prop({ required: true })
    start_time: Date

    @Prop({ required: true })
    end_time: Date

    @Prop({ required: true, default: PromotionUserGroup.ALL_CUSTOMER })
    user_group: PromotionUserGroup

    @Prop({ required: true })
    minBasketAmount: number
}
export const PromotionConditionSchema = SchemaFactory.createForClass(PromotionCondition)