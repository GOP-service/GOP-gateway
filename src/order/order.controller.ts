import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, InternalServerErrorException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTransportOrderDto } from './dto/create-transport-order';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { IOrderController, RequestWithUser } from 'src/utils/interfaces';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { OrderType, PaymentMethod, RoleType } from 'src/utils/enums';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrderDetails } from './entities/order.schema';
import { DeliveryOrder, DeliveryOrderType } from './entities/delivery_order.schema';
import { TransportOrder, TransportOrderType } from './entities/transport_order.schema';
import { log } from 'console';
import { SocketGateway } from 'src/socket/socket.gateway';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Order')
@Controller('order')
export class OrderController implements IOrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
    private readonly socketGateway: SocketGateway,
  ) {}

  async handleOrderCreatedEvent(payload: string) {
    throw new Error('Method not implemented.');
  }
  async handleOrderAssignedEvent(payload: string) {
    throw new Error('Method not implemented.');
  }
  async handleOrderStatusChangeEvent(payload: string) {
    throw new Error('Method not implemented.');
  }

  @Roles(RoleType.CUSTOMER) 
  @Post('create/transport')
  async placeTransportOrder(@Body() createOrderDto: CreateTransportOrderDto,@Req() req: RequestWithUser): Promise<any> {
    try {
      if (createOrderDto.payment_method == PaymentMethod.CASH) {
        return await this.orderService.TransportOrderPlace_Cash(createOrderDto, req.user.sub).then(order => {
          this.eventEmitter.emit('trasnport.order.created', order._id);
          return order;
        });

      } else {
        return 'Payment method not supported'
      }
    } catch (e) {
      return e
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
  @Post('create/delivery')
  placeDeliveryOrder(@Body() createOrderDto: CreateTransportOrderDto,@Req() req: RequestWithUser): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('quote/delivery')
  quoteDeliveryOrder(@Body() createOrderDto: CreateTransportOrderDto): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Roles(RoleType.CUSTOMER)
  @Post('cancel/:id')
  cancelOrder(@Body() dto:{reason:string, id: string}, @Req() req:RequestWithUser, ): Promise<any> {
    throw new Error('Method not implemented.');
  }

  // todo update DTO
  @Roles(RoleType.CUSTOMER) 
  @Post('customer/history') 
  async userGetOrder(@Req() req: RequestWithUser, dto: any): Promise<any> { 
    return await this.orderService.findAll({customer: req.user.sub, ...dto}).then(order => {
      return order 
    }).catch(e => { throw new InternalServerErrorException(e) });
  } 

  // todo update DTO
  @Roles(RoleType.DRIVER)
  @Post('driver/history')
  async driverGetOrder(@Req() req: RequestWithUser, dto: any): Promise<any> {
    return await this.orderService.findAll({dirver: req.user.sub, ...dto}).then(order => {
      return order
    }).catch(e => { throw new InternalServerErrorException(e) });
  }

  // todo update DTO
  @Roles(RoleType.RESTAURANT)
  @Post('restaurant/history')
  async restaurantGetOrder(@Req() req: RequestWithUser, dto: any): Promise<any> {
    return await this.orderService.findAll({order_type: OrderType.DELIVERY, restaurant: req.user.sub, ...dto}).then(order => {
      return order
    }).catch(e => { throw new InternalServerErrorException(e) });
  }

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
    return await this.orderService.findAll({});
  }
}
