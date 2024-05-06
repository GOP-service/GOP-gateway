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
        example: []
    })
    @IsArray()
    promotion_id: string[]

    @ApiProperty({
        title: 'LONG -> LAT',
        example: new LocationObject([ 106.7653176,10.8564044])
    })
    @IsNotEmpty()
    pickup_location: LocationObject

    @ApiProperty({
        title: 'Long -> Lat',
        example: 'coffe izy'
    })
    @IsString()
    @IsNotEmpty()
    pickup_address: string

    @ApiProperty({
        example: new LocationObject([106.7957762,10.8452565])
    })
    @IsNotEmpty()
    dropoff_location: LocationObject

    @ApiProperty({
        example: 'ĐH SPKT TP.HCM - Cơ sở 2'
    })
    @IsString()
    @IsNotEmpty()
    dropoff_address: string

    @ApiProperty({
        enum: VehicleType
    })
    @IsEnum(VehicleType)
    vehicle_type: VehicleType
}