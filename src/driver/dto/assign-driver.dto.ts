import { OrderDetailsType } from "src/order/entities/order.schema"
import { VehicleType } from "src/utils/enums"
import { LocationObject } from "src/utils/subschemas/location.schema"

export class AssignDriverDto {
    order: OrderDetailsType
    distance: number
    vehicle_type: VehicleType
}