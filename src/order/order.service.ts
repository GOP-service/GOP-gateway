import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { CreateTransportOrderDto } from './dto/create-transport-order';
import { VietMapService } from 'src/utils/map-api/viet-map.service';
import { BikeFare, BillStatus, CarFare, DistanceFare, OTPType, OTPVerifyStatus, OrderStatus, OrderType, PaymentMethod, RestaurantStatus, VehicleType } from 'src/utils/enums';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order';
import { LocationObject } from 'src/utils/subschemas/location.schema';
import { OrderFoodItems } from './entities/order_food_items.schema';
import { Otp, OtpDocument } from 'src/auth/entities/otp.schema';
import { PaymentService } from 'src/payment/payment.service';
import { CreateBillDto } from 'src/payment/dto/create-bill.dto';
import { Order, OrderDetails } from './entities/order.schema';
import { TransportOrder, TransportOrderType } from './entities/transport_order.schema';
import { DeliveryOrder, DeliveryOrderType } from './entities/delivery_order.schema';
import { BaseServiceAbstract } from 'src/utils/repository/base.service';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { Driver } from 'src/driver/entities/driver.schema';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { FoodItemDto } from 'src/restaurant/dto/food-item.dto';
import { ObjectId } from 'mongodb';
@Injectable()
export class OrderService extends BaseServiceAbstract< OrderDetails >{
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model< OrderDetails >,
        @InjectModel(TransportOrder.name) private readonly transportOrderModel: Model<TransportOrderType>,
        @InjectModel(DeliveryOrder.name) private readonly deliveryOrderModel: Model<DeliveryOrderType>,
        private readonly restaurantService: RestaurantService,
        private readonly vietMapService: VietMapService,
        private readonly paymentService: PaymentService,
    ) {
        super(orderModel);
    }

    private logger = new Logger('OrderService');


    async RestaurantAcceptOrder(orderId: string) {
        const now = new Date(); 
        const order = await this.orderModel.findByIdAndUpdate(orderId, {
            order_status: OrderStatus.PROGRESSING,
            confirm_time: now
        }, { new: true }).exec();
        return {
            msg: 'Restaurant has accepted the order'
        }
    }

    async RestaurantCompleteOrder(orderId: string) {
        const now = new Date(); 
        const order = await this.orderModel.findByIdAndUpdate(orderId, {
            order_status: OrderStatus.COMPLETED,
            complete_time: now
        }, { new: true }).exec();
        return {
            msg: 'order completed'
        }
    }

    async RestaurantRejectOrder(orderId: string, cancel_reason: string) {
        const order = await this.orderModel.findByIdAndUpdate(orderId, {
            order_status: OrderStatus.CANCELLED,
            cancel_reason: cancel_reason
        }, { new: true }).exec();
        return {
            msg: 'Restaurant has cancelled the order'
        }
    }


    async findAllOrder(): Promise<OrderDetails[]> {
        const orders = await this.orderModel.find({
            order_type: OrderType.DELIVERY,
            deleted_at: null
        })

        return orders;
    }

    async findCusOrderHistoryByAdmin(cus_id: string) {
        const orders = await this.orderModel.find({
            customer:  cus_id
        })
        return orders;
    }

    async findOrderByCustomer(customer_id: string) {
        const objectId = new ObjectId(customer_id);
        const orders = await this.orderModel.aggregate([
            {
                $match: {
                    customer: objectId,
                },
            },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: 'restaurant',
                    foreignField: '_id',
                    as: 'restaurant',
                    pipeline: [
                        {
                            $project: {
                                "restaurant_name": 1,
                                "cover_image": 1,
                                "_id": 0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$restaurant'
            },
            {
                $lookup: {
                    from: 'bills',
                    localField: 'bill',
                    foreignField: '_id',
                    as: 'bill',
                    pipeline: [
                        {
                            $project: {
                                "total": 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$bill"
            },
            {
                $unwind: "$items"
            },
            {
                $lookup: {
                    from: 'fooditems',
                    localField: 'items.food_id',
                    foreignField: '_id',
                    as: 'items.foodDetails',
                    pipeline: [
                        {
                            $project: {
                                "name": 1,
                                "_id": 0
                            }
                        }
                    ]
                }
            },
            {
                $unwind:  '$items.foodDetails'
            },
            {
                $group: {
                    _id: '$_id',
                    restaurant: { $first: '$restaurant' },
                    total: { $first: '$bill.total' },
                    items: {
                        $push: {
                            quantity: '$items.quantity',
                            food_name: '$items.foodDetails.name',
                        }
                    }
                }
            },
          ]).exec();
        return orders;
    }

    async findOrderByState(restaurant_id: string, state: OrderStatus) {
        const objectId = new ObjectId(restaurant_id);
        const orders = await this.orderModel.aggregate([
            {
                $match: {
                    restaurant: objectId,
                    order_status: state,
                },
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer',
                    pipeline: [
                        {
                            $project: {
                                "full_name": 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$customer'
            },
            {
                $lookup: {
                    from: 'bills',
                    localField: 'bill',
                    foreignField: '_id',
                    as: 'bill',
                    pipeline: [
                        {
                            $project: {
                                "order": 0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$bill"
            },
            {
                $unwind: "$items"
            },
            {
                $lookup: {
                    from: 'fooditems',
                    localField: 'items.food_id',
                    foreignField: '_id',
                    as: 'items.foodDetails',
                    pipeline: [
                        {
                            $project: {
                                "name": 1,
                                "image": 1,
                                "price": 1,
                                "_id": 0
                            }
                        }
                    ]
                }
            },
            {
                $unwind:  '$items.foodDetails'
            },
            {
                $lookup: {
                    from: 'modifiers',
                    localField: 'items.modifiers',
                    foreignField: '_id',
                    as: 'items.modifierDetails',
                    pipeline: [{
                        $project: {
                            "name": 1,
                            "price": 1,
                            "_id": 0
                        }
                    }]
                }
            },
            {
                $group: {
                    _id: '$_id',
                    customer: { $first: '$customer' },
                    order_status: { $first: '$order_status' },
                    order_time: { $first: '$order_time' },
                    order_cost: { $first: '$order_cost' },
                    delivery_fare: { $first: '$delivery_fare' },
                    bill: { $first: '$bill' },
                    items: {
                        $push: {
                            food_id: '$items.food_id',
                            quantity: '$items.quantity',
                            foodDetails: '$items.foodDetails',
                            modifiers: '$items.modifierDetails'
                        }
                    }
                }
            },
          ]).exec();
        return orders;
    }

    async getOrderDetails(id: string){
        const objectId = new ObjectId(id)
        const order = await this.orderModel.aggregate([
            {
                $match: {
                    _id: objectId
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customerInfo',
                    pipeline: [
                        {
                            $project: {
                                "phone": 1,
                                "full_name": 1,
                                "avatar": 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$customerInfo"
            },
            {
                $lookup: {
                    from: 'bills',
                    localField: 'bill',
                    foreignField: '_id',
                    as: 'bill',
                    pipeline: [
                        {
                            $project: {
                                "order": 0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$bill"
            },
            {
                $unwind: "$items"
            },
            {
                $lookup: {
                    from: 'fooditems',
                    localField: 'items.food_id',
                    foreignField: '_id',
                    as: 'items.foodDetails',
                    pipeline: [
                        {
                            $project: {
                                "name": 1,
                                "image": 1,
                                "price": 1,
                                "_id": 0
                            }
                        }
                    ]
                }
            },
            {
                $unwind:  '$items.foodDetails'
            },
            {
                $lookup: {
                    from: 'modifiers',
                    localField: 'items.modifiers',
                    foreignField: '_id',
                    as: 'items.modifierDetails',
                    pipeline: [{
                        $project: {
                            "name": 1,
                            "price": 1,
                            "_id": 0
                        }
                    }]
                }
            },
            {
                $group: {
                    _id: "$_id",
                    customer: { $first: "$customerInfo" },
                    delivery_location: { $first: '$delivery_location' },
                    order_time: { $first: '$order_time' },
                    complete_time: { $first: '$complete_time' },
                    confirm_time: { $first: '$confirm_time' },
                    order_cost: { $first: '$order_cost' },
                    delivery_fare: { $first: '$delivery_fare' },
                    bill: { $first: '$bill' },
                    items: {
                        $push: {
                            food_id: '$items.food_id',
                            quantity: '$items.quantity',
                            foodDetails: '$items.foodDetails',
                            modifiers: '$items.modifierDetails'
                        }
                    }
                }
            }
        ])

        return order[0];
    }

    async TransportOrderQuote(dto: CreateTransportOrderDto): Promise< TransportOrderType > {
        const new_transport_order = new this.transportOrderModel(dto);

        let { distance, duration} = await this.vietMapService.getDistanceNDuration(dto.pickup_location, dto.dropoff_location, dto.vehicle_type)
        new_transport_order.distance = distance;
        new_transport_order.duration = duration;
        if(dto.vehicle_type == VehicleType.CAR){
            new_transport_order.trip_fare = this.calculateFare(distance, CarFare);
        } else {
            new_transport_order.trip_fare = this.calculateFare(distance , BikeFare);
        }        
        return new_transport_order.toObject();
    }

    async TransportOrderPlace_Cash(dto: CreateTransportOrderDto, customer_id: string ): Promise<TransportOrderType> {

        const new_dto = {...dto, order_status: OrderStatus.ALLOCATING, customer: customer_id, order_time: new Date(Date.now()+7*60*60*1000),};
        let new_transport_order = new this.transportOrderModel(new_dto);

        // Get distance and duration from pickup to dropoff location form VietMap API
        Object.assign(new_transport_order, await this.vietMapService.getDistanceNDuration(dto.pickup_location, dto.dropoff_location, dto.vehicle_type));

        // Calculate fare based on distance
        if(dto.vehicle_type == VehicleType.CAR){
            new_transport_order.trip_fare = this.calculateFare(new_transport_order.distance, CarFare);
        } else {
            new_transport_order.trip_fare = this.calculateFare(new_transport_order.distance , BikeFare);
        }

        // Create bill for the order
    
        const bill = await this.paymentService.createBill({
            payment_method: PaymentMethod.CASH,
            order: new_transport_order,
        });
        new_transport_order.bill = bill;
        
        return (await new_transport_order.save()).toObject();
    }


    async DeliveryOrderQuote(dto: CreateDeliveryOrderDto, customer_id: string){
        const restaurant_location = await this.restaurantService.getRestaurantLocation(dto.restaurant_id);
        
        const new_dto = {...dto, customer: customer_id}

        const new_order = new this.deliveryOrderModel(new_dto);

        Object.assign(new_order, await this.vietMapService.getDistanceNDuration(restaurant_location, dto.delivery_location, VehicleType.BIKE));

        new_order.delivery_fare = this.calculateFare(new_order.distance, BikeFare);

        for (let item of dto.items){
            new_order.order_cost += await this.restaurantService.food_calculateFare(item)
        }
        
        const bill = await this.paymentService.quoteBill({
            payment_method: dto.payment_method,
            campaign_id: dto.campaign_ids,
            order: new_order,
        });

        const discount = bill.discount;
        const total = bill.total;
        return { ...new_order.toJSON(), discount, total };
    }

    async DeliveryOrderPlace(dto: CreateDeliveryOrderDto, customer_id: string) {
        const restaurant_location = await this.restaurantService.getRestaurantLocation(dto.restaurant_id);
        
        const restaurant = await this.restaurantService.findOneById(dto.restaurant_id);

        if(restaurant.status === RestaurantStatus.CLOSED){
            return {
                msg: 'Restaurant closed',
                bill: {}
            }
        }

        const new_dto = {...dto, customer: customer_id, restaurant: dto.restaurant_id}

        const new_order = new this.deliveryOrderModel(new_dto);

        const now = new Date(); 
        // now.setTime(now.getTime() + (7 * 60 * 60 * 1000));
        
        new_order.confirm_time = null;
        new_order.complete_time = null;
        new_order.order_time = now;

        Object.assign(new_order, await this.vietMapService.getDistanceNDuration(restaurant_location, dto.delivery_location, VehicleType.BIKE));

        new_order.delivery_fare = this.calculateFare(new_order.distance, BikeFare);

        const orderCostPromises = dto.items.map(async (item) => {
            return this.restaurantService.food_calculateFare(item);
          });
        new_order.order_cost = await Promise.all(orderCostPromises).then((costs) => costs.reduce((sum, cost) => sum + cost, 0));
        
        const bill = await this.paymentService.createBill({
            payment_method: dto.payment_method,
            campaign_id: dto.campaign_ids,
            order: new_order,
        });

        new_order.order_status = OrderStatus.PENDING_CONFIRM;

        const newBill = { ...bill}
        new_order.bill = newBill;

        const { order, ...billWithoutOrder } = bill;

        await new_order.save();
        return { 
            order: order._id,
            ...billWithoutOrder
        };
    }

    async trackingDeliveryOrder(orderId: string) {
        const order = await this.orderModel.findById(orderId);
        return order.order_status;
    }

    async DeliveryOrderPlace_Cash(dto: CreateDeliveryOrderDto, customer_id: string): Promise<DeliveryOrderType> {
        const restaurant_location = await this.restaurantService.getRestaurantLocation(dto.restaurant_id);
        const new_order = new this.deliveryOrderModel(dto);

        Object.assign(new_order, await this.vietMapService.getDistanceNDuration(restaurant_location, dto.delivery_location, VehicleType.BIKE));

        new_order.delivery_fare = this.calculateFare(new_order.distance, BikeFare);
        for (let item of dto.items){
            new_order.order_cost += await this.restaurantService.food_calculateFare(item)
        }

        const bill = await this.paymentService.createBill({
            payment_method: PaymentMethod.CASH,
            campaign_id: dto.campaign_ids,
            order: new_order,
        });
        new_order.bill = bill;

        return (await new_order.save()).toObject();
    }

    async cancelOrder(payload: CancelOrderDto){
        const order = await this.findOneByCondition({
            _id: payload.id,
            order_status: OrderStatus.PENDING_CONFIRM || OrderStatus.ALLOCATING || OrderStatus.PENDING_PICKUP
        });
        if(order){
            order.order_status = OrderStatus.CANCELLED;
            order.cancel_reason = payload.reason;
            this.paymentService.updateBillCancel(order);
            return this.update(order._id, order);
        } else {
            throw new ConflictException('Can not cancel this order');
        }
    }
    
    async failOrder(id: string){
        const order = await this.findOneById(id);
        order.order_status = OrderStatus.FAILED;

        this.paymentService.updateBillCancel(order);
        return this.update(id, order);
    }

    async orderCustomerCheck(id: string): Promise<boolean> {
        if( await this.orderModel.find({customer: id }).exec()){
            return true;
        } 
        return false;
    }

    async orderDriverCheck(id: string): Promise<boolean> {
        if( await this.orderModel.find({driver: id }).exec()){
            return true;
        } 
        return false;
    }

    async orderRestaurantCheck(id: string): Promise<boolean> {
        if( await this.orderModel.find({restaurant: id }).exec()){
            return true;
        } 
        return false;
    }

    async DriverAcceptOrder(order_id: string, driver: Driver): Promise<OrderDetails> {
        const order = await this.findOneById(order_id);
        order.driver = driver;
        order.order_status = OrderStatus.PENDING_PICKUP;
        return this.update(order_id, order);
    }

    async DriverRejectOrder(order_id: string, driver: Driver): Promise<OrderDetails> {
        const order = await this.findOneById(order_id);
        order.drivers_reject.push(driver._id);
        return this.update(order_id, order);
    }

    async orderDriverCheckAndChangeStatus(id: string, driver_id: string, status: OrderStatus): Promise<OrderDetails> {
        const order = await this.findOneById(id);
        if(order.driver._id != driver_id){
            throw new ConflictException('Driver not match');
        } else {
            order.order_status = status;
            return order;
        }
    }

    async orderComplete(id: string, driver_id: string) {
        const order = await this.findOneByCondition({_id: id, driver: driver_id}); 
        order.order_status = OrderStatus.COMPLETED;

        this.paymentService.updateBillComplete(order);
    }

    
    // async findOrderByDriverId(driver_id: string): Promise<OrderDetails[]> {
    //     return await this.orderModel.find({driver: driver_id})
    //                                 .populate({path: 'customer_id driver_id bill'})
    //                                 .exec();
    // }

    

    // async TransportOrderStatusChange_allocating(id: string, driver_id: string, status: OrderStatus): Promise<OrderDetails>  {
    //     return this.orderModel.findByIdAndUpdate(id, {driver_id: driver_id,order_status: status}, {new: true}).exec();
    // }

    // async TransportOrderStatusChange_allocated(id: string, driver_id: string, status: OrderStatus): Promise<OrderDetails>  {
    //     const result = await this.orderModel.findByIdAndUpdate(id, {order_status: status}, {new: true}).exec();
    //     if (result.driver_id != driver_id) {
    //         throw new Error('Driver not match');
    //     } else {
    //         return result;
    //     }
    // }

    // async findOrderById(id: string): Promise<OrderDetails> {
    //     return this.orderModel.findById(id).exec();
    // }

    // async findOrderByRestaurantId(id: string): Promise<OrderDetails[]> {
    //     return this.orderModel.find({restaurant_id: id}).exec();
    // }

    // async DeliveryOrderStatusChange(order_id: string, status: OrderStatus, driver_id: string = null): Promise<OrderDetails>{
    //     const order = await this.orderModel.findByIdAndUpdate(order_id,{driver_id: driver_id, order_status: status}, {new: true}).exec();
    //     if(order){
    //         if(driver_id!=null && driver_id!=order.driver_id){
    //             throw new Error('Driver not match')
    //         } else return order;
    //     }
    // }

    // async createOTPOrder(owner_id: string): Promise<OtpDocument>{
    //     const newOtp = new this.otpModel({
    //         owner_id: owner_id,
    //         type: OTPType.VERIFY_PARCEL,
    //       })
    //     return await newOtp.save();
    // }

    // async verifyOtp(owner_id: string, otp: string): Promise<OTPVerifyStatus> {
    //     const otpCheck = await this.otpModel.findOne({ owner_id: owner_id, otp: otp, type: OTPType.VERIFY_PARCEL }).exec();
    //     if (!otpCheck) {
    //       return OTPVerifyStatus.OTP_WRONG;
    //     } else {
    //       if (otpCheck.expired_at < Date.now()) {
    //         return OTPVerifyStatus.OTP_EXPIRED;
    //       } else {
    //         this.otpModel.findByIdAndDelete(otpCheck._id).exec();
    //         return OTPVerifyStatus.SUCCESS;
    //       }
    //     }
    //   }

    private calculateFare(distance: number, type: DistanceFare): number {
        distance = Math.round(distance/1000);
        if(distance<=2){
            return distance * type.First2Km
        } else if (distance<=10){
            return 12000 + (distance-2) * type.Next8Km 
        } else {
            return 52000 + (distance-10)* type.Over10Km
        } 
    }
    
}
