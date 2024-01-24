import { IntersectionType, PickType } from "@nestjs/swagger";
import { OtpDto } from "./otp.dto";
import { CreateAccountDto } from "./create-acc.dto";

export class OtpVerifyDto extends IntersectionType(
    PickType(CreateAccountDto, ['email'] as const),
    OtpDto
){}