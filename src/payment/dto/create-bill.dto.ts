import { Order, OrderDetails, OrderDetailsType } from "src/order/entities/order.schema";
import { PaymentMethod } from "src/utils/enums";

export class CreateBillDto {
    payment_method: PaymentMethod;
    promotion_id: string[];
    order: OrderDetailsType;
}
