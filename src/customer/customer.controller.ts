import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { PaymentMethod, RoleType } from 'src/utils/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderService } from 'src/order/order.service';
import { CreateTransportOrderDto } from 'src/order/dto/create-transport-order';
import { RequestWithUser } from 'src/utils/interfaces';
import { CreateDeliveryOrderDto } from 'src/order/dto/create-delivery-order';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'),RolesGuard)
@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly restaurantService: RestaurantService,
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
      if (createOrderDto.payment_method == PaymentMethod.CASH) {
        const new_transport_order = await this.orderService.TransportOrderPlace_Cash(createOrderDto, req.user.sub);
        this.eventEmitter.emit('order.trip.created', new_transport_order);
        return new_transport_order;
      } else {
        return 'Payment method not supported'
      }
    } catch (e) {
      return e
    }
  }

  @Roles(RoleType.CUSTOMER)
  @Post('food/place')
  async placeFoodOrder(@Body() createOrderDto: CreateDeliveryOrderDto, @Req() req: RequestWithUser) {
    try {      
      let restaurant = await this.restaurantService.findOneId(createOrderDto.restaurant_id);
      let new_delivery_order = await this.orderService.createDeliveryOrder_Cash(createOrderDto, req.user.role_id.customer, restaurant.location)
      this.eventEmitter.emit('order.food.created', new_delivery_order);
      return new_delivery_order;
    } catch (e) {
      return e
    }
  }
}
