import { PartialType } from "@nestjs/swagger";
import { CustomerDto } from "./customer.dto";

export class UpdateCustomerDto extends PartialType(CustomerDto){

}
