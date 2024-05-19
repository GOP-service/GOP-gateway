import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CampaignUserGroup } from "src/utils/enums";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    _id: false,
    timestamps: false
})
export class CampaignCondition {
    @Prop({ required: true })
    start_time: Date

    @Prop({ required: true })
    end_time: Date

    @Prop({ required: true, default: CampaignUserGroup.ALL_CUSTOMER })
    user_group: CampaignUserGroup

    @Prop({ required: true })
    minBasketAmount: number
}
export const CampaignConditionSchema = SchemaFactory.createForClass(CampaignCondition)