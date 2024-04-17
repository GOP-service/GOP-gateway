import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './entities/order.schema';
import { Model } from 'mongoose';
import { TransportOrder, TransportOrderDocument } from './entities/transport_order.schema';
import { DeliveryOrder, DeliveryOrderDocument } from './entities/delivery_order.schema';
import { CreateTransportOrderDto } from './dto/create-transport-order';
import { VietMapService } from 'src/utils/map-api/viet-map.service';
import { BikeFare, CarFare, DistanceFare, OrderStatus, VehicleType } from 'src/utils/enums';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
        @InjectModel(TransportOrder.name) private readonly transportOrderModel: Model<TransportOrderDocument>,
        @InjectModel(DeliveryOrder.name) private readonly deliveryOrderModel: Model<DeliveryOrderDocument>,
        
        private readonly vietMapService: VietMapService,
    ) {}


    async TransportOrderQuote(dto: CreateTransportOrderDto): Promise<TransportOrderDocument> {
        const new_transport_order = new this.transportOrderModel(dto);

        let { distance, duration} = await this.vietMapService.getDistanceNDuration(dto.pickup_location, dto.dropoff_location, dto.vehicle_type)
        new_transport_order.distance = distance;
        new_transport_order.duration = duration;
        if(dto.vehicle_type == VehicleType.CAR){
            new_transport_order.trip_fare = this.calculateFare(distance, CarFare);
        } else {
            new_transport_order.trip_fare = this.calculateFare(distance , BikeFare);
        }        
        return new_transport_order;
    }

    async TransportOrderPlace(dto: CreateTransportOrderDto, customer_id: string ): Promise<TransportOrderDocument> {
        const new_dto = {...dto, order_status: OrderStatus.ALLOCATING, customer_id: customer_id, order_time: new Date(Date.now()+7*60*60*1000)};
        let new_transport_order = new this.transportOrderModel(new_dto);

        Object.assign(new_transport_order, await this.vietMapService.getDistanceNDuration(dto.pickup_location, dto.dropoff_location, dto.vehicle_type));

        if(dto.vehicle_type == VehicleType.CAR){
            new_transport_order.trip_fare = this.calculateFare(new_transport_order.distance, CarFare);
        } else {
            new_transport_order.trip_fare = this.calculateFare(new_transport_order.distance , BikeFare);
        }
        
        return new_transport_order.save();
    }

    async TransportOrderStatusChange_allocating(id: string, driver_id: string, status: OrderStatus): Promise<OrderDocument> {
        return this.orderModel.findByIdAndUpdate(id, {driver_id: driver_id,order_status: status}, {new: true}).exec();
    }

    async TransportOrderStatusChange_allocated(id: string, driver_id: string, status: OrderStatus): Promise<OrderDocument> {
        const result = await this.orderModel.findByIdAndUpdate(id, {order_status: status}, {new: true}).exec();
        if (result.driver_id != driver_id) {
            throw new Error('Driver not match');
        } else {
            return result;
        }
    }


    async findOrderById(id: string): Promise<OrderDocument> {
        return this.orderModel.findById(id).exec();
    }

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
