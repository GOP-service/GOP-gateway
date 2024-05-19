import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { CreateTransportOrderDto } from './dto/create-transport-order';
import { VietMapService } from 'src/utils/map-api/viet-map.service';
import { BikeFare, BillStatus, CarFare, DistanceFare, OTPType, OTPVerifyStatus, OrderStatus, PaymentMethod, VehicleType } from 'src/utils/enums';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order';
import { LocationObject } from 'src/utils/subschemas/location.schema';
import { OrderFoodItems, OrderFoodItemsDocument } from './entities/order_food_items.schema';
import { Otp, OtpDocument } from 'src/auth/entities/otp.schema';
import { PaymentService } from 'src/payment/payment.service';
import { CreateBillDto } from 'src/payment/dto/create-bill.dto';
import { Order, OrderDetails } from './entities/order.schema';
import { TransportOrder, TransportOrderType } from './entities/transport_order.schema';
import { DeliveryOrder, DeliveryOrderType } from './entities/delivery_order.schema';
import { BaseServiceAbstract } from 'src/utils/repository/base.service';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { Driver } from 'src/driver/entities/driver.schema';

@Injectable()
export class OrderService extends BaseServiceAbstract< OrderDetails >{
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model< OrderDetails >,
        @InjectModel(TransportOrder.name) private readonly transportOrderModel: Model<TransportOrderType>,
        @InjectModel(DeliveryOrder.name) private readonly deliveryOrderModel: Model<DeliveryOrderType>,
        @InjectModel(OrderFoodItems.name) private readonly orderFoodItemsModel: Model<OrderFoodItemsDocument>,
        private readonly vietMapService: VietMapService,
        private readonly paymentService: PaymentService,
    ) {
        super(orderModel);
    }

    private logger = new Logger('OrderService');
    // async createDeliveryOrder_Cash(dto: CreateDeliveryOrderDto, customer_id: string, restaurant_location: LocationObject): Promise<deliveryOrderModel>{
    //     const subtotal = dto.items.reduce((total, item) => total + item.price * item.quantity, 0)

    //     const new_dto = {...dto, subtotal: subtotal, order_status: OrderStatus.PENDING_COMFIRM, customer_id: customer_id, order_time: new Date(Date.now()+7*60*60*1000)};

    //     let new_delivery_order = new this.deliveryOrderModel(new_dto);

    //     Object.assign(new_delivery_order, await this.vietMapService.getDistanceNDuration(restaurant_location, dto.delivery_location, VehicleType.BIKE));

    //     new_delivery_order.delivery_fare = this.calculateFare(new_delivery_order.distance , BikeFare);

    //     return new_delivery_order.save();
    // }

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
            // promotion_id: dto.promotion_id,
            order: new_transport_order,
        });
        new_transport_order.bill = bill;

        
        return (await new_transport_order.save()).toObject();
    }

    async cancelOrder(payload: CancelOrderDto){
        const order = await this.findOneByCondition({
            _id: payload.id,
            order_status: OrderStatus.PENDING_COMFIRM || OrderStatus.ALLOCATING || OrderStatus.PENDING_PICKUP
        });
        if(order){
            order.order_status = OrderStatus.CANCELLED;
            order.cancel_reason = payload.reason;
            return  this.update(order._id, order);
        } else {
            throw new ConflictException('Can not cancel this order');
        }
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
