import { OmitType } from "@nestjs/swagger";
import { CustomerDto } from "./customer.dto";

export class createCustomerDto extends OmitType(CustomerDto, ['avatar'] as const)
{}