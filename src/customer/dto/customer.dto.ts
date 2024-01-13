import { ApiProperty } from "@nestjs/swagger";

export class CustomerDto{
    @ApiProperty()
    full_name: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    avatar: string;
}