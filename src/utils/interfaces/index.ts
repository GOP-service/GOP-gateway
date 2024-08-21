import { CreateTransportOrderDto } from "src/order/dto/create-transport-order";
import { RoleType } from "../enums";
import { Response } from 'express';
import { CreateDeliveryOrderDto } from "src/order/dto/create-delivery-order";
import { UpdateRestaurantDto } from "src/restaurant/dto/update-restaurant.dto";
import { CreateRestaurantCategoryDto } from "src/restaurant/dto/create-restaurant-category.dto";
import { UpdateRestaurantCategoryDto } from "src/restaurant/dto/update-restaurant-category.dto";
import { CreateFoodItemDto } from "src/restaurant/dto/create-food-item.dto";
import { CancelOrderDto } from "src/order/dto/cancel-order.dto";
import { UpdateFoodItemDto } from "src/restaurant/dto/update-food-item.dto";
import { CreateCampaignDto } from "src/payment/dto/create-campaign.dto";
import { UpdateCampaignnDto } from "src/payment/dto/update-campaign.dto";
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

    createReview(req: RequestWithUser, res: Response): Promise<any>;

}

export interface IDriverController {

    getProfile(req: RequestWithUser, res: Response): Promise<any>

    updateProfile(req: RequestWithUser, dto: any): Promise<any>

    updateActiveStatus(req: RequestWithUser, dto: string): Promise<any>

}

export interface IRestaurantController {

    fetchInfoByCustomer(id: string, body: { coordinates: number[] })

    fetchInfo(req: RequestWithUser)

    fetchMenu(id: string)

    getProfile(): Promise<any>

    updateProfile(): Promise<any>

    getRestaurants(body: { coordinates: number[] }): Promise<any>

    createMenu(): Promise<any>

    updateMenu(): Promise<any>

    deleteMenu(): Promise<any>

    createPromotion(): Promise<any>

    updatePromotion(): Promise<any>

    deletePromotion(): Promise<any>

    getOrderDetails(): Promise<any>

    getOrders(): Promise<any>

    deleteOrder(): Promise<any>

    getRevenueStatistics(): Promise<any>

    fetchCategory(req: RequestWithUser)

    createCategory(req: RequestWithUser, body: CreateRestaurantCategoryDto): Promise<any>

    updateCategory(req: RequestWithUser, id: string, body: UpdateRestaurantCategoryDto): Promise<any>

    deleteCategory(req: RequestWithUser, id: string): Promise<any>

    fetchFoodDetails(id: string)

    createFoodItem(req: RequestWithUser, body: CreateFoodItemDto, image: any): Promise<any>

    updateFoodItem(body: UpdateFoodItemDto): Promise<any>

    updateFoodItemImage(food_item_id: string, image: Express.Multer.File): any

    deleteFoodItem(req: RequestWithUser, body: { category_id: string, foodItem_id: string }): Promise<any>
}

export interface IAdminController {
    getCustomers(): Promise<any>
    getCustomerInfo(): Promise<any>
    searchCustomers(): Promise<any>
    blockCustomer(): Promise<any>

    getDrivers(): Promise<any>
    getDriverInfo(): Promise<any>
    searchDrivers(): Promise<any>
    blockDriver(): Promise<any>


    getRestaurants(): Promise<any>
    getRestaurantInfo(): Promise<any>
    searchRestaurants(): Promise<any>
    getRestaurantStatistics(): Promise<any>
    getStatisticsByRestaurant(): Promise<any>
    blockRestaurant(): Promise<any>

    getOrders(): Promise<any>
    searchOrders(): Promise<any> 

    getRevenueStatistics(): Promise<any>
}

export interface ICampaign {
    getCampaigns(): Promise<any>
    getCampaignsByOwnerId(id: string): Promise<any>
    getCampaignDetails(): Promise<any>
    createCampaign(body: CreateCampaignDto): Promise<any>
    updateCampaign(body: UpdateCampaignnDto): Promise<any>
    deleteCampaign( id: string, req: RequestWithUser): Promise<any>
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

    placeDeliveryOrder(createOrderDto: any, req: RequestWithUser);

    quoteDeliveryOrder(createOrderDto: any, req: RequestWithUser): Promise<any>;

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

