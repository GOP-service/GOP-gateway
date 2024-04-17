import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RoleType } from 'src/utils/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderService } from 'src/order/order.service';
import { CreateTransportOrderDto } from 'src/order/dto/create-transport-order';
import { RequestWithUser } from 'src/utils/interfaces';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'),RolesGuard)
@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  
  @Roles(RoleType.CUSTOMER) 
  @Get()
  hello() {
    return 'hello customer'
  }

  @Post('transport/quote')
  quoteTransportOrder(@Body() createOrderDto: CreateTransportOrderDto) {
    try {
      return this.orderService.TransportOrderQuote(createOrderDto);
    } catch (e) {
      return e
    }
  }

  @Roles(RoleType.CUSTOMER)
  @Post('transport/place')
  async placeTransportOrder(@Body() createOrderDto: CreateTransportOrderDto, @Req() req: RequestWithUser ) {
    try {
      const new_transport_order = await this.orderService.TransportOrderPlace(createOrderDto, req.user.sub);
      this.eventEmitter.emit('order.created', new_transport_order);
      return new_transport_order;
    } catch (e) {
      return e
    }
  }

}
