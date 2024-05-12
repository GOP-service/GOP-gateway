import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";
import { LocationObject } from "src/utils/subschemas/location.schema";
import { OrderFoodItems } from "../entities/order_food_items.schema";

export class CreateDeliveryOrderDto extends CreateOrderDto {
    @ApiProperty({
        title: 'Restaurant ID',
        example: '661f7f2fc8760e2c2737fb8c'
    })
    @IsNotEmpty()
    restaurant_id: string

    @ApiProperty({
        title: 'LONG -> LAT',
        example: new LocationObject([106.77163744626203, 10.849841965343426], 'Đại học Sư phạm Kỹ thuật TP.HCM')
    })
    @IsNotEmpty()
    delivery_location: LocationObject

    @ApiProperty({
        title: 'Address',
        example: 'Đại học Sư phạm Kỹ thuật TP.HCM'
    })
    @IsString()
    @IsNotEmpty()
    delivery_address: string

    @ApiProperty({
        title: 'Items',
        example: [{
            name: 'Cà phê đen',
            modifiers: [],
            price: 32000,
            quantity: 1,
            specification: ''
        }]
    })
    @IsNotEmpty()
    items: OrderFoodItems[]
}