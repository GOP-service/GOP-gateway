import { IntersectionType, PickType } from "@nestjs/swagger";
import { CreateAccountDto } from "./create-acc.dto";

export class ForgotPasswordRequestDto extends IntersectionType(
    PickType(CreateAccountDto, ['email'] as const)
){}