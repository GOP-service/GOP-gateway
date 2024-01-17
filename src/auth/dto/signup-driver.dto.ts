import { IntersectionType, OmitType } from "@nestjs/swagger";
import { DriverDto } from "src/driver/dto/driver.dto";
import { CreateAccountDto } from "./create-acc.dto";

export class SignupDriverDto extends IntersectionType(
    CreateAccountDto,
    OmitType(DriverDto, ['avatar'] as const),
){}