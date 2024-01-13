import { IntersectionType } from "@nestjs/swagger";
import { SigninDto } from "./signin.dto";
import { DriverDto } from "src/driver/dto/driver.dto";

export class SignupDriverDto extends IntersectionType(
    SigninDto,
    DriverDto
){
}