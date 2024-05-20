import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { CustomerService } from 'src/customer/customer.service';
import { DriverService } from 'src/driver/driver.service';
import { UpdateLocationDriverDto } from 'src/driver/dto/update-location-driver.dto';
import { OrderDocument } from 'src/order/entities/order.schema';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { Server,Socket } from "socket.io";
import { OrderService } from 'src/order/order.service';
import { OrderStatus, OrderType, VehicleType } from 'src/utils/enums';
import { CreateDeliveryOrderDto } from 'src/order/dto/create-delivery-order';
import { error } from 'console';
import { TransportOrderType } from 'src/order/entities/transport_order.schema';



@WebSocketGateway({
  namespace: 'socket',
  cors: { origin: '*' },
})
export class SocketGateway implements NestGateway {
  @WebSocketServer()
  server: Server;
  
  constructor(
    private readonly driverService: DriverService,
    private readonly restaurantService: RestaurantService,
    private readonly customerService: CustomerService
  ) {}
  private logger = new Logger('SocketGateway')

  afterInit(server: Server) {
    console.log('Socket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected with id: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected');
  }

  // * STATE TRACKING
  notifyOrderState(order: string, order_status: OrderStatus){
    const msg = {
      order_id: order,
      message: order_status
    }
    this.server.emit(`order.status.${order}`, msg);
  }

  // @OnEvent('transport.order.created')
  // async handleTransportOrderCreatedEvent(payload: TransportOrderType) {
  //   const driver = await this.driverService.findDriverInDistance({
  //     coor: payload.pickup_location,
  //     vehicle_type: payload.vehicle_type,
  //     distance: 5000, // 5km
  //     reject_drivers: payload.drivers_reject
  //   });

  //   if (driver) {
  //     this.logger.log(`Driver ${driver._id} has been assigned to order ${payload._id}`);
  //     this.notifyOrderAssign_Driver(driver._id, payload._id);
  //   } else {
  //     this.logger.log(`No driver found for order ${payload._id}`);
  //     this.notifyOrderState(payload._id, OrderStatus.FAILED);

  //     this.orderService.update(payload._id, {order_status: OrderStatus.FAILED})
  //   }
  // }

  // *ASSIGN ORDER TRACKING
  notifyOrderAssign_Driver(driver: string, order: string){
    const msg = {
      order_id: order,
    }
    this.server.emit(`driver.order.assign.${driver}`, msg);
  }

  notifyOrderAssign_Restaurant(restaurant: string, order: string){
    const msg = {
      order_id: order,
    }
    this.server.emit(`restaurant.order.assign.${restaurant}`, msg);
  }

  @SubscribeMessage('driver.location')
  async handleDriverLocation(client: Socket, @MessageBody() payload: UpdateLocationDriverDto){
    this.logger.log(`Driver ${payload.driver} is at ${payload.location.coordinates}`);
    if(payload.order_id){
      this.notifyOrderState(payload.order_id, payload.order_status);
    }
    await this.driverService.updateDriverLocation(payload.driver, payload.location);
  }


  // // DELIVERY ORDER
  // @OnEvent('order.food.created')
  // notifyRestaurantNewOrder(payload: DeliveryOrderDocument) {
  //   const msg = {
  //     order_id: payload._id,
  //     message: `You have a new order waiting for comfirmation`
  //   }
  //   this.server.emit(`restaurant.waiting.order.${payload.restaurant_id}`, msg)
  // }

  // @OnEvent('order.food.allocating')
  // async notifyOrderPrepared(payload: DeliveryOrderDocument) {
  //   let restaurant = await this.restaurantService.findOneId(payload.restaurant_id)
  //   const driver = await this.driverService.findDriverInDistance(restaurant.location, 10000, VehicleType.BIKE); //! 10km
    
  //   if(driver){
  //     const order = await this.orderService.DeliveryOrderStatusChange(payload._id, OrderStatus.PENDING_PICKUP, driver.id);
  //     // * SEND NOTIFICATION
  //     this.server.emit(`order.allocate.${driver.id}`, order);

  //     const msg = {
  //       order_id: payload._id,
  //       driver_id: driver.id,
  //       message: `Driver has been assigned`
  //     }

  //     this.server.emit(`order.status.${payload.restaurant_id}`, msg);
  //     this.server.emit(`order.status.${payload.customer_id}`, msg);
  //   } else {
  //     this.orderService.DeliveryOrderStatusChange(payload._id,OrderStatus.CANCELLED, null);
  //     // * SEND NOTIFICATION 
  //     const msg = {
  //       order_id: payload._id,
  //       customer_id: payload.customer_id,
  //       message: `the order: ${payload._id} cancelled due to no driver available`
  //     }
  //     this.server.emit(`order.status.${payload.customer_id}`, msg);
  //     this.server.emit(`order.status.${payload.restaurant_id}`, msg);
  //   }
  // }

  // @OnEvent('order.driver.accept')
  // async notifyDeliveryOrderIsAccepted(payload: DeliveryOrderDocument | TransportOrderDocument) {
  //   const msg = {
  //     order_id: payload._id,
  //     customer_id: payload.customer_id,
  //     message: `the order: ${payload._id} is accepted by driver ${payload.driver_id}`
  //   }

  //   this.server.emit(`order.status.${payload.customer_id}`, msg);

  //   if('restaurant_id' in payload){
  //     this.server.emit(`order.status.${payload.restaurant_id}`, msg);
  //   }
  // }

  // @OnEvent('order.driver.reject')
  // async notifyDeliveryOrderIsReject(payload: DeliveryOrderDocument | TransportOrderDocument) {
  //   const msg = {
  //     order_id: payload._id,
  //     customer_id: payload.customer_id,
  //     message: `the order: ${payload._id} is rejected by driver ${payload.driver_id}`
  //   }
  //   this.server.emit(`order.status.${payload.customer_id}`, msg);
  //   if('restaurant_id' in payload){
  //     this.server.emit(`order.status.${payload.restaurant_id}`, msg);
  //   }
  // }

  // @OnEvent('order.arrived_restaurant')
  // async notifyDriverArrivedRestaurant(payload: DeliveryOrderDocument){
  //   const msg = {
  //     order_id: payload._id,
  //     customer_id: payload.customer_id,
  //     message: 'the driver has arrived at the restaurant'
  //   }
  //   this.server.emit(`order.status.${payload.customer_id}`, msg);
  //   this.server.emit(`order.status.${payload.restaurant_id}`, msg);
  // }

  // @OnEvent('order.droppingoff')
  // async notifyOrderDroppingOff(payload: DeliveryOrderDocument){
  //   const msgCustomer = {
  //     order_id: payload._id,
  //     message: 'Driver on the way to drop-off'
  //   }
  //   const msgDriver = {
  //     order_id: payload._id,
  //     message: 'Verify otp success'
  //   }
  //   this.server.emit(`order.status.${payload.customer_id}`, msgCustomer);
  //   this.server.emit(`order.status.${payload.driver_id}`, msgDriver);
  // }

  // // * TRIGGER ALLOCATE FROM ORDER CREATED
  // @OnEvent('order.trip.created')
  // async allocateDriver(payload: TransportOrderDocument) {
  //   const driver = await this.driverService.findDriverInDistance(payload.pickup_location, 10000, payload.vehicle_type); //! 10km
  //   if(driver){
  //     const order = await this.orderService.TransportOrderStatusChange_allocating(payload._id, driver.id, OrderStatus.PENDING_PICKUP);
  //     // * SEND NOTIFICATION
  //     this.server.emit(`order.allocate.${driver.id}`, order);
  //   } else {
  //     this.orderService.TransportOrderStatusChange_allocating(payload._id, null, OrderStatus.CANCELLED);
  //     // * SEND NOTIFICATION 
  //     const msg = {
  //       order_id: payload._id,
  //       customer_id: payload.customer_id,
  //       message: `the order: ${payload._id} cancelled due to no driver available`
  //     }
  //     this.server.emit(`order.status.${payload.customer_id}`, msg);
  //   }
  // }

  // @OnEvent('order.trip.driver.accept')
  // async notifyOrderIsAccepted(payload: OrderDocument) {
  //   // * SEND NOTIFICATION
  //   const msg = {
  //     order_id: payload._id,
  //     customer_id: payload.customer_id,
  //     message: `the order: ${payload._id} is accepted by driver ${payload.driver_id}`
  //   }
  //   this.server.emit(`order.status.${payload.customer_id}`, msg);
  // }

  // @OnEvent('order.driver.reject')
  // async notifyOrderIsRejected(payload: OrderDocument) {
  //   // * SEND NOTIFICATION
  //   const msg = {
  //     order_id: payload._id,
  //     customer_id: payload.customer_id,
  //     message: `the order: ${payload._id} is rejected by driver ${payload.driver_id}`
  //   }
  //   this.server.emit(`order.status.${payload.customer_id}`, msg);
  // }

  // @OnEvent('order.trip.arrived_pickup')
  // async notifyDriverArrived(payload: OrderDocument) {
  //   // * SEND NOTIFICATION
  //   const msg = {
  //     order_id: payload._id,
  //     customer_id: payload.customer_id,
  //     message: 'the driver has arrived at the pickup location'
  //   }
  //   this.server.emit(`order.status.${payload.customer_id}`, msg);
  // }

  // @OnEvent('order.trip.picked_up')
  // async notifyDriverPickedUp(payload: OrderDocument) {
  //   // * SEND NOTIFICATION
  //   const msg = {
  //     order_id: payload._id,
  //     customer_id: payload.customer_id,
  //     message: 'the driver has picked up the customer'
  //   }
  //   this.server.emit(`order.status.${payload.customer_id}`, msg);
  // }

  // @OnEvent('order.completed')
  // async notifyOrderIsCompleted(payload: OrderDocument | DeliveryOrderDocument) {
  //   // * SEND NOTIFICATION
  //   const msg = {
  //     order_id: payload._id,
  //     customer_id: payload.customer_id,
  //     message: `the order: ${payload._id} is completed`
  //   }
  //   this.server.emit(`order.status.${payload.customer_id}`, msg);
  //   if('restaurant_id' in payload){
  //     this.server.emit(`order.status.${payload.restaurant_id}`, msg);
  //   }
  // }

  // @SubscribeMessage('driver.location')
  // handleDriverLocation(client: Socket, @MessageBody() payload: string){
  //     const data = JSON.parse(payload) as UpdateLocationDriverDto;
  //     this.logger.log(`Driver ${data.driver_id} is at ${data.location.coordinates}`);
  //     this.driverService.updateLocation(data.driver_id, data.location);
  // }

  // @SubscribeMessage('msg')
  // handleMessage(client: Socket, @MessageBody() payload: string) {
  //   this.logger.log(payload);
  //   this.server.emit('msg1', payload);
  // }


  // RESTAURANT ROOM SOCKET
  // @SubscribeMessage('restaurant.open')
  // handleRestaurantActiveStatus(@ConnectedSocket() client: Socket, @MessageBody() restaurant_id: string) {
  //   client.join(restaurant_id)
  // }
}
