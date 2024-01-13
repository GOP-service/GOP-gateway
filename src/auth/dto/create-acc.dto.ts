import { IsNotEmpty } from "class-validator";
import { Role } from "../entities/role.schema";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {
    @ApiProperty()
    phone: string;

    @ApiProperty()
    password: string;
}
