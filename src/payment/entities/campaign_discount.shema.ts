import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CampaignDiscountType } from "src/utils/enums";
import { CampaignScope } from "./campaign_scope.schema";

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    },
    _id: false,
    timestamps: false
})
export class CampaignDiscount {
    @Prop({ require: true })
    type: CampaignDiscountType

    @Prop()
    cap: number

    @Prop({ required: true })
    value: number

    @Prop({ required: true })
    scope: CampaignScope
}

export const CampaignDiscountSchema = SchemaFactory.createForClass(CampaignDiscount)