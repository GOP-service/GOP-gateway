import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CampaignScopeType } from "src/utils/enums";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    _id: false,
    timestamps: false
})
export class CampaignScope {
    @Prop({ required: true })
    type: CampaignScopeType

    @Prop()
    object_ids: string[]
}
export const CampaignScopeSchema = SchemaFactory.createForClass(CampaignScope)