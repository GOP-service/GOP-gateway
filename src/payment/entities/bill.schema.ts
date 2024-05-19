import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Order } from "src/order/entities/order.schema";
import { BillStatus, PaymentMethod } from "src/utils/enums";
import { BaseEntity } from "src/utils/repository/base.entity";

export type BillDocument = HydratedDocument<Bill>;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Bill extends BaseEntity {
    @Prop({ enum: BillStatus, default: BillStatus.PENDING })
    status: BillStatus

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Order'})
    order: Order

    @Prop({ required: true, enum: PaymentMethod, default: PaymentMethod.CASH })
    payment_method: PaymentMethod

    @Prop()
    transaction_id: string

    @Prop({ })
    campaign_id: string[]

    @Prop({ })
    total: number

    @Prop({ })
    sub_total: number

    @Prop({  })
    discount: number

    @Prop({ default: 2000 })
    platform_fee: number
}

export const BillSchema = SchemaFactory.createForClass(Bill);