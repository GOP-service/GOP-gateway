import { AccountDocument } from "src/auth/entities/account.schema"
import { CustomerDocument } from "src/customer/entities/customer.schema"
import { DriverDocument } from "src/driver/entities/driver.schema"
import { RestaurantDocument } from "src/restaurant/entities/restaurant.schema"
import { RoleType } from "../enums"

export interface JwtPayload {
    sub: string
    role: RoleType
}

export interface RequestWithCustomer extends Request {
    user: CustomerDocument
}

export interface RequestWithDriver extends Request {
    user: DriverDocument
}

export interface RequestWithRestaurant extends Request {
    user: RestaurantDocument
}

export interface RequestWithAdmin extends Request {
    user: AccountDocument
}