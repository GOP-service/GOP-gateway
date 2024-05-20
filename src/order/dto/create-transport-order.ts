import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";
import { LocationObject } from "src/utils/subschemas/location.schema";
import { PaymentMethod, VehicleType } from "src/utils/enums";
 
export class CreateTransportOrderDto extends CreateOrderDto {
    @ApiProperty({
        example: PaymentMethod.CASH
    })
    @IsEnum(PaymentMethod)
    payment_method: PaymentMethod


    @ApiProperty({
        title: 'LONG -> LAT',
        example: new LocationObject([ 106.7653176,10.8564044], 'coffe izy')
    })
    @IsNotEmpty()
    pickup_location: LocationObject

    @ApiProperty({
        example: new LocationObject([106.7957762,10.8452565], 'ĐH SPKT TP.HCM - Cơ sở 2')
    })
    @IsNotEmpty()
    dropoff_location: LocationObject

    @ApiProperty({
        enum: VehicleType
    })
    @IsEnum(VehicleType)
    vehicle_type: VehicleType
}