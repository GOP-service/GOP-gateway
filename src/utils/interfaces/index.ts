import { CreateTransportOrderDto } from "src/order/dto/create-transport-order";
import { RoleType } from "../enums";
import { Response } from 'express';
import { CreateDeliveryOrderDto } from "src/order/dto/create-delivery-order";
import { ApplyPromotionDto } from "src/payment/dto/apply-promotion.dto";
import { CancelOrderDto } from "src/order/dto/cancel-order.dto";
import { TransportOrderType } from "src/order/entities/transport_order.schema";
import { DeliveryOrderType } from "src/order/entities/delivery_order.schema";
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

    getProfile(req: RequestWithUser, res: Response): Promise<any>

    updateProfile(req: RequestWithUser, dto: any): Promise<any>

    updateActiveStatus(req: RequestWithUser, dto: string): Promise<any>

}

export interface IRestaurantController {
    getProfile(): Promise<any>

    updateProfile(): Promise<any>

    createMenu(): Promise<any>

    updateMenu(): Promise<any>

    deleteMenu(): Promise<any>

    createPromotion(): Promise<any>

    updatePromotion(): Promise<any>

    deletePromotion(): Promise<any>

    createDiscount(): Promise<any>

    updateDiscount(): Promise<any>

    deleteDiscount(): Promise<any>

    getRestaurantRevenueStats(): Promise<any>
}

export interface IAdminController {

}

export interface IPayment {
    topUp(): Promise<any>

    withdraw(): Promise<any>

    createTransaction(): Promise<any>

    cancelTransaction(): Promise<any>

    refundPayment(): Promise<any>
}


export interface IOrderController {
    // // event handlers
    // handleTransportOrderCreatedEvent(payload: TransportOrderType): void; // initiate transport order 

    // handleDeliveryOrderCreatedEvent(payload: DeliveryOrderType): void; // initiate delivery order

    // handleOrderStatusChangeEvent(payload: any): void; // tracking  order status

    // customer

    placeTransportOrder(createOrderDto: CreateTransportOrderDto, req: RequestWithUser): Promise<any>;
    
    quoteTransportOrder(createOrderDto: CreateTransportOrderDto): Promise<any>;

    placeDeliveryOrder(createOrderDto: CreateTransportOrderDto, req: RequestWithUser): Promise<any>;

    quoteDeliveryOrder(createOrderDto: CreateTransportOrderDto): Promise<any>;

    cancelOrderCustomer(dto:CancelOrderDto, req: RequestWithUser): Promise<any>;

    orderHistoryCustomer(req: RequestWithUser, dto: any): Promise<any>;

    // driver

    acceptOrderDriver(req: RequestWithUser, id: any): Promise<any>;

    rejectOrderDriver(req: RequestWithUser, id: any, res: any): Promise<any>;

    cancelOrderDriver(req: RequestWithUser, dto: CancelOrderDto): Promise<any>;

    arriving(req: RequestWithUser, dto: any): Promise<any>;

    arrivedPickup(req: RequestWithUser, dto: any): Promise<any>;

    arrivedRestaurant(req: RequestWithUser, dto: any): Promise<any>;

    pickedUp(req: RequestWithUser, dto: any): Promise<any>;

    completeOrder(req: RequestWithUser, dto: any): Promise<any>;

    orderHistoryDriver(req: RequestWithUser, dto: any): Promise<any>;

    // restaurant

    acceptOrderRestaurant(req: RequestWithUser, dto: any): Promise<any>;

    rejectOrderRestaurant(req: RequestWithUser, dto: any): Promise<any>;

    cancelOrderRestaurant(req: RequestWithUser, dto: CancelOrderDto): Promise<any>;

    orderHistoryRestaurant(req: RequestWithUser, dto: any): Promise<any>;

    // updateOrder(id: string, dto: any): Promise<any>;

    findOrderByDriverId(id: string): Promise<any>;

    findOrderByCustomerId(id: string): Promise<any>;

    findOrderByRestaurantId(id: string): Promise<any>;
    
    findOrderById(id: string): Promise<any>;

    findAll(): Promise<any>;

}

