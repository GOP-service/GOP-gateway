import { BillStatus } from "src/utils/enums";

export class CreateBillDto {
    status: BillStatus;
    payment_method: string;
    total: number;
}
