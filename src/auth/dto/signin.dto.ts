import { OmitType } from "@nestjs/swagger";
import { CreateAccountDto } from "./create-acc.dto";

export class SigninDto extends OmitType(CreateAccountDto, ['full_name'] as const){
}