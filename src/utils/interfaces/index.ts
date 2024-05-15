import { CreateTransportOrderDto } from "src/order/dto/create-transport-order";
import { RoleType } from "../enums";
import { Response } from 'express';
import { CreateDeliveryOrderDto } from "src/order/dto/create-delivery-order";
import { ApplyPromotionDto } from "src/payment/dto/apply-promotion.dto";
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

    modifyProfile(req: RequestWithUser, dto: any, res: Response): Promise<any>;

    createReview(req: RequestWithUser, res: Response): Promise<any>;

    deleteReview(req: RequestWithUser, id:string, res: Response): Promise<any>;
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

    performTransaction(): Promise<any>

    refundPayment(): Promise<any>
}


export interface IOrderController {
    handleOrderCreatedEvent(payload: string): void; // initiate order 

    handleOrderAssignedEvent(payload: string): void; // assign driver

    handleOrderStatusChangeEvent(payload: string): void; // tracking  order status

    placeTransportOrder(createOrderDto: CreateTransportOrderDto, req: RequestWithUser): Promise<any>;
    
    quoteTransportOrder(createOrderDto: CreateTransportOrderDto): Promise<any>;

    placeDeliveryOrder(createOrderDto: CreateTransportOrderDto, req: RequestWithUser): Promise<any>;

    quoteDeliveryOrder(createOrderDto: CreateTransportOrderDto): Promise<any>;

    cancelOrder(dto:{reason:string, id: string}, req: RequestWithUser): Promise<any>;

    // updateOrder(id: string, dto: any): Promise<any>;

    userGetOrder(req: RequestWithUser, dto: any): Promise<any>;

    driverGetOrder(req: RequestWithUser, dto: any ): Promise<any>;

    restaurantGetOrder(req: RequestWithUser, dto: any): Promise<any>;

    findOrderByDriverId(id: string): Promise<any>;

    findOrderByCustomerId(id: string): Promise<any>;

    findOrderByRestaurantId(id: string): Promise<any>;
    
    findOrderById(id: string): Promise<any>;

    findAll(): Promise<any>;

}

