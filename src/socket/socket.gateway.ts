import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { CustomerService } from 'src/customer/customer.service';
import { DriverService } from 'src/driver/driver.service';
import { UpdateLocationDriverDto } from 'src/driver/dto/update-location-driver.dto';
import { OrderDocument } from 'src/order/entities/order.schema';
import { TransportOrderDocument } from 'src/order/entities/transport_order.schema';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { Server,Socket } from "socket.io";
import { OrderService } from 'src/order/order.service';
import { OrderStatus, OrderType, VehicleType } from 'src/utils/enums';
import { CreateDeliveryOrderDto } from 'src/order/dto/create-delivery-order';
import { error } from 'console';
import { DeliveryOrderDocument } from 'src/order/entities/delivery_order.schema';



@WebSocketGateway({
  namespace: 'socket',
  cors: { origin: '*' },
})
export class SocketGateway implements NestGateway {
  @WebSocketServer()
  server: Server;
  
  constructor(
    private readonly customerService: CustomerService,
    private readonly driverService: DriverService,
    private readonly restaurantService: RestaurantService,
    private readonly orderService: OrderService,
    
  ) {}
  private logger = new Logger('SocketGateway')

  afterInit(server: Server) {
    console.log('Socket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected with id: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
  }

  // DELIVERY ORDER
  @OnEvent('order.food.created')
  notifyRestaurantNewOrder(payload: DeliveryOrderDocument) {
    const msg = {
      order_id: payload._id,
      message: `You have a new order waiting for comfirmation`
    }
    this.server.emit(`restaurant.waiting.order.${payload.restaurant_id}`, msg)
  }

  @OnEvent('order.food.allocating')
  async notifyOrderPrepared(payload: DeliveryOrderDocument) {
    let restaurant = await this.restaurantService.findOneId(payload.restaurant_id)
    const driver = await this.driverService.findDriverInDistance(restaurant.location, 10000, VehicleType.BIKE); //! 10km
    
    if(driver){
      const order = await this.orderService.DeliveryOrderStatusChange(payload._id, OrderStatus.PENDING_PICKUP, driver.id);
      // * SEND NOTIFICATION
      this.server.emit(`order.allocate.${driver.id}`, order);

      const msg = {
        order_id: payload._id,
        driver_id: driver.id,
        message: `Driver has been assigned`
      }

      this.server.emit(`order.status.${payload.restaurant_id}`, msg);
      this.server.emit(`order.status.${payload.customer_id}`, msg);
    } else {
      this.orderService.DeliveryOrderStatusChange(payload._id,OrderStatus.CANCELLED, null);
      // * SEND NOTIFICATION 
      const msg = {
        order_id: payload._id,
        customer_id: payload.customer_id,
        message: `the order: ${payload._id} cancelled due to no driver available`
      }
      this.server.emit(`order.status.${payload.customer_id}`, msg);
      this.server.emit(`order.status.${payload.restaurant_id}`, msg);
    }
  }

  @OnEvent('order.driver.accept')
  async notifyDeliveryOrderIsAccepted(payload: DeliveryOrderDocument | TransportOrderDocument) {
    const msg = {
      order_id: payload._id,
      customer_id: payload.customer_id,
      message: `the order: ${payload._id} is accepted by driver ${payload.driver_id}`
    }

    this.server.emit(`order.status.${payload.customer_id}`, msg);

    if('restaurant_id' in payload){
      this.server.emit(`order.status.${payload.restaurant_id}`, msg);
    }
  }

  @OnEvent('order.driver.reject')
  async notifyDeliveryOrderIsReject(payload: DeliveryOrderDocument | TransportOrderDocument) {
    const msg = {
      order_id: payload._id,
      customer_id: payload.customer_id,
      message: `the order: ${payload._id} is rejected by driver ${payload.driver_id}`
    }
    this.server.emit(`order.status.${payload.customer_id}`, msg);
    if('restaurant_id' in payload){
      this.server.emit(`order.status.${payload.restaurant_id}`, msg);
    }
  }

  @OnEvent('order.arrived_restaurant')
  async notifyDriverArrivedRestaurant(payload: DeliveryOrderDocument){
    const msg = {
      order_id: payload._id,
      customer_id: payload.customer_id,
      message: 'the driver has arrived at the restaurant'
    }
    this.server.emit(`order.status.${payload.customer_id}`, msg);
    this.server.emit(`order.status.${payload.restaurant_id}`, msg);
  }

  @OnEvent('order.droppingoff')
  async notifyOrderDroppingOff(payload: DeliveryOrderDocument){
    const msgCustomer = {
      order_id: payload._id,
      message: 'Driver on the way to drop-off'
    }
    const msgDriver = {
      order_id: payload._id,
      message: 'Verify otp success'
    }
    this.server.emit(`order.status.${payload.customer_id}`, msgCustomer);
    this.server.emit(`order.status.${payload.driver_id}`, msgDriver);
  }

  // * TRIGGER ALLOCATE FROM ORDER CREATED
  @OnEvent('order.trip.created')
  async allocateDriver(payload: TransportOrderDocument) {
    const driver = await this.driverService.findDriverInDistance(payload.pickup_location, 10000, payload.vehicle_type); //! 10km
    if(driver){
      const order = await this.orderService.TransportOrderStatusChange_allocating(payload._id, driver.id, OrderStatus.PENDING_PICKUP);
      // * SEND NOTIFICATION
      this.server.emit(`order.allocate.${driver.id}`, order);
    } else {
      this.orderService.TransportOrderStatusChange_allocating(payload._id, null, OrderStatus.CANCELLED);
      // * SEND NOTIFICATION 
      const msg = {
        order_id: payload._id,
        customer_id: payload.customer_id,
        message: `the order: ${payload._id} cancelled due to no driver available`
      }
      this.server.emit(`order.status.${payload.customer_id}`, msg);
    }
  }

  @OnEvent('order.trip.driver.accept')
  async notifyOrderIsAccepted(payload: OrderDocument) {
    // * SEND NOTIFICATION
    const msg = {
      order_id: payload._id,
      customer_id: payload.customer_id,
      message: `the order: ${payload._id} is accepted by driver ${payload.driver_id}`
    }
    this.server.emit(`order.status.${payload.customer_id}`, msg);
  }

  @OnEvent('order.driver.reject')
  async notifyOrderIsRejected(payload: OrderDocument) {
    // * SEND NOTIFICATION
    const msg = {
      order_id: payload._id,
      customer_id: payload.customer_id,
      message: `the order: ${payload._id} is rejected by driver ${payload.driver_id}`
    }
    this.server.emit(`order.status.${payload.customer_id}`, msg);
  }

  @OnEvent('order.trip.arrived_pickup')
  async notifyDriverArrived(payload: OrderDocument) {
    // * SEND NOTIFICATION
    const msg = {
      order_id: payload._id,
      customer_id: payload.customer_id,
      message: 'the driver has arrived at the pickup location'
    }
    this.server.emit(`order.status.${payload.customer_id}`, msg);
  }

  @OnEvent('order.trip.picked_up')
  async notifyDriverPickedUp(payload: OrderDocument) {
    // * SEND NOTIFICATION
    const msg = {
      order_id: payload._id,
      customer_id: payload.customer_id,
      message: 'the driver has picked up the customer'
    }
    this.server.emit(`order.status.${payload.customer_id}`, msg);
  }

  @OnEvent('order.completed')
  async notifyOrderIsCompleted(payload: OrderDocument | DeliveryOrderDocument) {
    // * SEND NOTIFICATION
    const msg = {
      order_id: payload._id,
      customer_id: payload.customer_id,
      message: `the order: ${payload._id} is completed`
    }
    this.server.emit(`order.status.${payload.customer_id}`, msg);
    if('restaurant_id' in payload){
      this.server.emit(`order.status.${payload.restaurant_id}`, msg);
    }
  }

  @SubscribeMessage('driver.location')
  handleDriverLocation(client: Socket, @MessageBody() payload: string){
      const data = JSON.parse(payload) as UpdateLocationDriverDto;
      this.logger.log(`Driver ${data.driver_id} is at ${data.location.coordinates}`);
      this.driverService.updateLocation(data.driver_id, data.location);
  }

  // RESTAURANT ROOM SOCKET
  // @SubscribeMessage('restaurant.open')
  // handleRestaurantActiveStatus(@ConnectedSocket() client: Socket, @MessageBody() restaurant_id: string) {
  //   client.join(restaurant_id)
  // }
}
