import { PartialType } from "@nestjs/swagger";
import { DriverDto } from "./driver.dto";

export class UpdateDriverDto extends PartialType(DriverDto){
}
