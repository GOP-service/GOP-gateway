import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";
import { LocationObject } from "src/utils/subschemas/location.schema";
import { OrderFoodItems } from "../entities/order_food_items.schema";

export class CreateDeliveryOrderDto extends CreateOrderDto {
    @ApiProperty({
        title: 'Restaurant ID',
        example: '6640631fc9edf07952c1683e'
    })
    @IsNotEmpty()
    restaurant_id: string

    
    @ApiProperty({
        example: []
    })
    @IsArray()
    campaign_id: string[]
    
    @ApiProperty({
        title: 'LONG -> LAT',
        example: new LocationObject([106.77163744626203, 10.849841965343426], 'Đại học Sư phạm Kỹ thuật TP.HCM')
    })
    @IsNotEmpty()
    delivery_location: LocationObject

    @ApiProperty({
        example: [
            new OrderFoodItems(
                '6647a4011216ae8cfd4a9c21',
                2,
                ['6647a3ff1216ae8cfd4a9c11', '6647a3ff1216ae8cfd4a9c0c', '6647a3ff1216ae8cfd4a9c0e']
            )
        ]
    })
    @IsNotEmpty()
    items: OrderFoodItems[]
}