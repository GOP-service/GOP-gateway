import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, InternalServerErrorException, ConflictException, Res, Logger, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTransportOrderDto } from './dto/create-transport-order';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { IOrderController, RequestWithUser } from 'src/utils/interfaces';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { OrderStatus, OrderType, PaymentMethod, RoleType } from 'src/utils/enums';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SocketGateway } from 'src/socket/socket.gateway';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { TransportOrderType } from './entities/transport_order.schema';
import { DeliveryOrderType } from './entities/delivery_order.schema';
import { DriverService } from 'src/driver/driver.service';
import { Response } from 'express';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order';
import { log } from 'console';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Order')
@Controller('order')
export class OrderController implements IOrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
    private readonly socketGateway: SocketGateway,
    private readonly driverService: DriverService,
  ) {}

  private logger = new Logger('OrderController')
  //**  EVENT HANDLE  **/
  async handleTransportOrderAssignmentEvent(payload: TransportOrderType) {
    if(payload.drivers_reject.length > 3) {
      this.socketGateway.notifyOrderState(payload._id, OrderStatus.FAILED);
      this.orderService.failOrder(payload._id)
    }

    const driver = await this.driverService.findDriverInDistance({
      coor: payload.pickup_location,
      vehicle_type: payload.vehicle_type,
      distance: 5000, // 5km
      reject_drivers: payload.drivers_reject
    });

    if (driver) {
      this.logger.log(`Driver ${driver._id} has been assigned to order ${payload._id}`);
      this.socketGateway.notifyOrderAssign_Driver(driver._id, payload._id);
    } else {
      this.logger.log(`No driver found for order ${payload._id}`);
      this.socketGateway.notifyOrderState(payload._id, OrderStatus.FAILED);
      this.orderService.failOrder(payload._id)
    }
  }

  //todo ~~~~~~~~
  async handleDeliveryOrderAssignmentEvent(payload: DeliveryOrderType) {
    throw new Error('Method not implemented.');
  }


  async handleOrderStatusChangeEvent(payload: TransportOrderType, status: OrderStatus ) {
    this.socketGateway.notifyOrderState(payload._id, status);
  }

  //**  CUSTOMER  **/
  @Roles(RoleType.CUSTOMER) 
  @Post('create/transport')
  async placeTransportOrder(@Body() createOrderDto: CreateTransportOrderDto,@Req() req: RequestWithUser): Promise<any> {
    try {
      if (createOrderDto.payment_method == PaymentMethod.CASH) {
        const order = await this.orderService.TransportOrderPlace_Cash(createOrderDto, req.user.sub)
         this.handleTransportOrderAssignmentEvent(order);
        return order;
      } else {
        return 'Payment method not supported'
      }  
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  @Post('quote/transport')
  async quoteTransportOrder(@Body() createOrderDto: CreateTransportOrderDto): Promise<any> {
    try {
      return this.orderService.TransportOrderQuote(createOrderDto);
    } catch (e) {
      return e
    }
  }


  @Roles(RoleType.CUSTOMER)
  @Post('quote/delivery')
  quoteDeliveryOrder(@Body() createOrderDto: CreateDeliveryOrderDto, @Req() req: RequestWithUser): Promise<any> {
    return this.orderService.DeliveryOrderQuote(createOrderDto, req.user.sub);
  }

  @Post('create/delivery')
  async placeDeliveryOrder(@Body() createOrderDto: CreateDeliveryOrderDto, @Req() req: RequestWithUser) {
    const bill = await this.orderService.DeliveryOrderPlace(createOrderDto, req.user.sub);
    this.socketGateway.placeDeliveryOrder(createOrderDto.restaurant_id);
    return bill
  }

  @Roles(RoleType.CUSTOMER)
  @Post('customer/cancel/:id')
  async cancelOrderCustomer(@Body() dto: CancelOrderDto,@Req() req: RequestWithUser) {
    if (await this.orderService.orderCustomerCheck(dto.id)) {
      try {
        dto.reason = `Customer:  + ${dto.reason}`
        return await this.orderService.cancelOrder(dto);
      } catch (error) {
        throw error;
      }
    } else {
      throw new ConflictException('You can not cancel this order');
    }
  }
  
  // todo update DTO
  @Roles(RoleType.CUSTOMER)
  @Get('customer/history')
  async orderHistoryCustomer(@Req() req: RequestWithUser) {
    try {
      const orders = await this.orderService.findOrderByCustomer(req.user.sub);
      return orders;
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }



  //**  DRIVER  **/
  @Roles(RoleType.DRIVER)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID'
  })
  @Get('driver/accept/:id')
  async acceptOrderDriver(@Req() req: RequestWithUser,@Param('id') dto: any) {
    if(!dto) throw new BadRequestException('Order ID is required');
    const driver = await this.driverService.findOneById(req.user.sub);
    try {
      this.handleOrderStatusChangeEvent(dto, OrderStatus.PENDING_PICKUP);
      return await this.orderService.DriverAcceptOrder(dto, driver);
    } catch (error) {
      throw error;
    }
  }

  @Roles(RoleType.DRIVER)
  @ApiParam({
    name: 'id',
    description: 'Order ID'
  })
  @Get('driver/reject/:id')
  async rejectOrderDriver(@Req() req: RequestWithUser,@Param('id') dto: any, @Res() res: Response) {
    if(!dto) throw new BadRequestException('Order ID is required');
    const driver = await this.driverService.findOneById(req.user.sub);
    try {
      const order = await this.orderService.DriverRejectOrder(dto, driver);
      this.handleTransportOrderAssignmentEvent(order);
      return res.status(200).json({message: 'Order rejected'});
    } catch (error) {
      throw error;
    }
  }

  @Roles(RoleType.DRIVER)
  @Post('driver/cancel')
  async cancelOrderDriver(@Req() req: RequestWithUser,@Body() dto: CancelOrderDto) {
    if (this.orderService.orderDriverCheck(req.user.sub)) {
      try {
        dto.reason = `Driver:  + ${dto.reason}`
        return this.orderService.cancelOrder(dto);
      } catch (error) {
        throw error;
      }
    }
    return new ConflictException('You can not cancel this order');
  }

  @Roles(RoleType.DRIVER)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Order ID'
  })
  @Get('driver/arriving/:id')
  async arriving(req: RequestWithUser, @Param('id') dto: any) {
    return this.orderService.orderDriverCheckAndChangeStatus(req.user.sub, dto, OrderStatus.PICKING_UP);
  }

  @Roles(RoleType.DRIVER)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Order ID'
  })
  @Get('driver/arrived/pickup/:id')
  async arrivedPickup(req: RequestWithUser, @Param('id') dto: any) {
    return this.orderService.orderDriverCheckAndChangeStatus(req.user.sub, dto, OrderStatus.PENDING_DROP_OFF);
  }

  //todo update 
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Order ID'
  })
  @Roles(RoleType.DRIVER)
  @Get('driver/arrived/restaurant/:id')
  async arrivedRestaurant(req: RequestWithUser, @Param('id') dto: any) {
    throw new Error('Method not implemented.');
  }

  @Roles(RoleType.DRIVER)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Order ID'
  })
  @Get('driver/pickedup/:id')
  async pickedUp(req: RequestWithUser, @Param() dto: any) {
    return this.orderService.orderDriverCheckAndChangeStatus(req.user.sub, dto, OrderStatus.DROPPING_OFF);
  }

  @Roles(RoleType.DRIVER)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Order ID'
  })
  @Get('driver/complete/:id')
  async completeOrder(req: RequestWithUser, @Param() dto: any) {
    return this.orderService.orderDriverCheckAndChangeStatus(req.user.sub, dto, OrderStatus.COMPLETED);
  }

  @Roles(RoleType.DRIVER)
  @Post('driver/history')
  async orderHistoryDriver(@Req() req: RequestWithUser, @Body() dto: any) {
    throw new Error('Method not implemented.');
  }

  // todo update DTO
  @Roles(RoleType.DRIVER)
  @Post('driver/history')
  async driverGetOrder(@Req() req: RequestWithUser, dto: any) {
    return await this.orderService.findAll({dirver: req.user.sub, ...dto}).then(order => {
      return order
    }).catch(e => { throw new InternalServerErrorException(e) });
  }

  //**  RESTAURANT  **/

  @Roles(RoleType.RESTAURANT)
  @Get('restaurant/accept/:id')  
  async acceptOrderRestaurant(@Req() req: RequestWithUser,@Param('id') id: string): Promise<any> {
    try {
      const res = await this.orderService.RestaurantAcceptOrder(id)
      return res;
    } catch (error) {
      throw new Error("Accept failed")
    }
  }

  @Roles(RoleType.RESTAURANT)
  @Get('restaurant/complete/:id')
  completeOrderRestaurant(@Req() req: RequestWithUser,@Param('id') id: string): Promise<any> {
    try {
      const res = this.orderService.RestaurantCompleteOrder(id)
      return res;
    } catch (error) {
      throw new Error("Complete failed")
    }
  }

  @Roles(RoleType.RESTAURANT)
  @Post('restaurant/reject')
  rejectOrderRestaurant(@Req() req: RequestWithUser, @Body() body: { cancel_reason: string, id: string }): Promise<any> {
    try {
      const res = this.orderService.RestaurantRejectOrder(body.id, body.cancel_reason)
      return res;
    } catch (error) {
      throw new Error("Reject failed")
    }
  }

  @Roles(RoleType.RESTAURANT)
  @Post('restaurant/cancel')
  cancelOrderRestaurant(@Req() req: RequestWithUser,@Body() dto: CancelOrderDto): Promise<any> {
    throw new Error('Method not implemented.');
  }

  // todo update DTO
  @Roles(RoleType.RESTAURANT)
  @Post('restaurant/history')
  async orderHistoryRestaurant(@Req() req: RequestWithUser, dto: any): Promise<any> {
    return await this.orderService.findAll({order_type: OrderType.DELIVERY, restaurant: req.user.sub, ...dto}).then(order => {
      return order
    }).catch(e => { throw new InternalServerErrorException(e) });
  }

  //**  COMMON FOR ADMIN  **/

  findOrderByDriverId(id: string): Promise<any> {
    throw new Error('Method not implemented.');
    // return this.orderService.findOrderByDriverId(id);
  }

  findOrderByCustomerId(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  findOrderByRestaurantId(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  findOrderById(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  
  @Get('all')
  async findAll() {
    try {
      const orders = this.orderService.findAllOrder();
      return orders;
    } catch (error) {
      throw new Error('Get orders failed')
    }
  }

  @Get(':id/details')
  findOrderDetails(@Param('id') id: string) {
    try {
      const order = this.orderService.getOrderDetails(id);
      return order;
    } catch (error) {
      throw new Error('Order not found')
    }
  }

  @Get(':id/tracking')
  async findOrderSate(@Param('id') id: string) {
    const orderState = await this.orderService.trackingDeliveryOrder(id);
    return {
      _id: id,
      state: orderState
    }
  }

  @Roles(RoleType.RESTAURANT)
  @Get('state/pending-confirm')
  OrderPendingByRestaurant(@Req() req: RequestWithUser){
      try {
        const orders = this.orderService.findOrderByState(req.user.sub, OrderStatus.PENDING_CONFIRM)
        return orders;
      } catch (error) {
        throw new Error('Failed')
      }
  }

  @Roles(RoleType.RESTAURANT)
  @Get('state/progressing')
  OrderProgressingByRestaurant(@Req() req: RequestWithUser){
      try {
        const orders = this.orderService.findOrderByState(req.user.sub, OrderStatus.PROGRESSING)
        return orders;
      } catch (error) {
        throw new Error('Failed')
      }
  }

  @Roles(RoleType.RESTAURANT)
  @Get('state/completed')
  OrderCompletedByRestaurant(@Req() req: RequestWithUser){
      try {
        const orders = this.orderService.findOrderByState(req.user.sub, OrderStatus.COMPLETED)
        return orders;
      } catch (error) {
        throw new Error('Failed')
      }
  }

  @Roles(RoleType.RESTAURANT)
  @Get('state/cancelled')
  OrderCancelledByRestaurant(@Req() req: RequestWithUser){
      try {
        const orders = this.orderService.findOrderByState(req.user.sub, OrderStatus.CANCELLED)
        return orders;
      } catch (error) {
        throw new Error('Failed')
      }
  }
}
