import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { CustomerService } from 'src/customer/customer.service';
import { DriverService } from 'src/driver/driver.service';
import { UpdateLocationDriverDto } from 'src/driver/dto/update-location-driver.dto';
import { OrderDocument } from 'src/order/entities/order.schema';
import { TransportOrderDocument } from 'src/order/entities/transport_order.schema';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { Server,Socket } from "socket.io";
import { OrderService } from 'src/order/order.service';
import { OrderStatus, OrderType } from 'src/utils/enums';


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
  
  // * TRIGGER ALLOCATE FROM ORDER CREATED
  @OnEvent('order.created')
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

  @OnEvent('order.driver.accept')
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
  async notifyOrderIsCompleted(payload: OrderDocument) {
    // * SEND NOTIFICATION
    const msg = {
      order_id: payload._id,
      customer_id: payload.customer_id,
      message: `the order: ${payload._id} is completed`
    }
    this.server.emit(`order.status.${payload.customer_id}`, msg);
  }

  @SubscribeMessage('driver.location')
  handleDriverLocation(client: Socket, @MessageBody() payload: string){
      const data = JSON.parse(payload) as UpdateLocationDriverDto;
      this.logger.log(`Driver ${data.driver_id} is at ${data.location.coordinates}`);
      this.driverService.updateLocation(data.driver_id, data.location);
  }

  
}
