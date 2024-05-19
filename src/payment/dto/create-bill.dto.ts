import { Order, OrderDetails, OrderDetailsType } from "src/order/entities/order.schema";
import { PaymentMethod } from "src/utils/enums";

export class CreateBillDto {
    payment_method: PaymentMethod;
    campaign_id: string[];
    order: OrderDetailsType;
}
