import { CreateTransportOrderDto } from "src/order/dto/create-transport-order";
import { RoleType } from "../enums";
import { Response } from 'express';
import { CreateDeliveryOrderDto } from "src/order/dto/create-delivery-order";
export interface JwtPayload {
    sub: string
    role: RoleType
    refreshToken: string
}

export interface RequestWithUser extends Request {
    user: JwtPayload
}
export type FindAllResponse<T> = { count: number; items: T[] };

export interface BaseServiceInterface<T> {
    create(dto: T | any): Promise<T>;

    findOneById(id: string, projection?: string): Promise<T>;

    findOneByCondition(condition?: object, projection?: string): Promise<T>;

    findAll(
        condition: object,
        options?: object,
    ): Promise<FindAllResponse<T>>;

    update(id: string, dto: Partial<T>): Promise<T>;

    softDelete(id: string): Promise<boolean>;

    permanentlyDelete(id: string): Promise<boolean>;
}

export interface ICustomerController {
    getProfile(req: RequestWithUser, res: Response): Promise<any>

    modifyProfile(req: RequestWithUser, res: Response): Promise<any>

    quoteTransportOrder(createOrderDto: CreateTransportOrderDto): Promise<any>

    placeTransportOrder(createOrderDto: CreateTransportOrderDto, req: RequestWithUser): Promise<any>

    quoteFoodOrder(createOrderDto: CreateDeliveryOrderDto): Promise<any>

    placeFoodOrder(createOrderDto: CreateDeliveryOrderDto, req: RequestWithUser): Promise<any>

    createReview(): Promise<any>

    deleteReview(): Promise<any>

    getOrderHistory(): Promise<any>

    getOrderDetails(): Promise<any>
    
    cancelOrder(): Promise<any>
}

export interface IDriverController {

    getProfile(): Promise<any>

    updateProfile(): Promise<any>

    acceptOrder(): Promise<any>

    rejectOrder(): Promise<any>

    updateActiveStatus(): Promise<any>

    arrivedPickup(): Promise<any>

    pickedUp(): Promise<any>

    arrivedRestaurant(): Promise<any>

    completeOrder(): Promise<any>

    cancelOrder(): Promise<any>

    getDriverRevenueStats(): Promise<any>
}

export interface IRestaurantController {

}

export interface IAdminController {

}

export interface IPayment {
    topup(): Promise<any>

    withdraw(): Promise<any>

    createTransaction(): Promise<any>

    cancelTransaction(): Promise<any>

    refundPayment(): Promise<any>
}