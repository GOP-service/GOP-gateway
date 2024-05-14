import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTransportOrderDto } from './dto/create-transport-order';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/utils/interfaces';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { OrderType, RoleType } from 'src/utils/enums';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrderDetails } from './entities/order.schema';
import { DeliveryOrder, DeliveryOrderType } from './entities/delivery_order.schema';
import { TransportOrder, TransportOrderType } from './entities/transport_order.schema';
import { log } from 'console';
import { SocketGateway } from 'src/socket/socket.gateway';

@ApiBearerAuth()
@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
    private readonly socketGateway: SocketGateway,
  ) {}

  @OnEvent('order.created')
  handleOrderCreatedEvent(payload: string) {
    this.socketGateway.notifyOrderAssign_Driver(payload, payload);
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   try {
  //     return this.orderService.findOrderById(id);
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // @Post('place')
  // async placeOrder(@Body() createOrderDto: CreateTransportOrderDto, @Req() req: RequestWithUser) {
  //   try {
  //     const order = await this.orderService.TransportOrderPlace_Cash(createOrderDto, req.user.sub);
  //     // this.eventEmitter.emit('order.created', order);
  //     return order;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // @Get(':id')
  // async getOrderById(@Param('id') id: string) {
  //   try {
  //     const result = await this.orderService.findOneById(id);
  //     if (result.order_type === OrderType.DELIVERY) {
  //       return 'Delivery Order';
  //     } else if (result.order_type === OrderType.TRANSPORT){
  //       return 'Transport Order';
  //     }
  //     return result;
      
  //   } catch (error) {
  //     return error;
  //   }
  // }

  
}
