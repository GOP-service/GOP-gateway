import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { BaseEntity } from "src/utils/repository/base.entity"
import { Bill } from "./bill.schema"
import { HydratedDocument, SchemaTypes } from "mongoose"

export type RevenueHistoryDocument = HydratedDocument<RevenueHistory>

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true
})
export class RevenueHistory extends BaseEntity {
    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'Bill'})
    Bill: Bill

    @Prop()
    restaurant_profit: number

    @Prop()
    platform_profit: number

    @Prop()
    driver_profit: number
}

export const RevenueHistorySchema = SchemaFactory.createForClass(RevenueHistory)