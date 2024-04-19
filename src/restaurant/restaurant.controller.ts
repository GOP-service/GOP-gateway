import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { OTPType, OTPVerifyStatus, OrderStatus, RoleType } from 'src/utils/enums';
import { AccountService } from 'src/auth/account.service';
import { RequestWithUser } from 'src/utils/interfaces';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';
import { UpdateItemsRestaurantDto } from './dto/update-item-restaurant-category.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderService } from 'src/order/order.service';


@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'),RolesGuard)
@ApiTags('Restaurants')
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly orderService: OrderService,
    private readonly restaurantService: RestaurantService,
    private readonly eventEmitter: EventEmitter2,
    ) {}
    
  @Roles(RoleType.RESTAURANT)
  @Get('info')
  info(@Req() req: RequestWithUser) {
    return this.restaurantService.findOneId(req.user.role_id.restaurant);
  }
  
  @Roles(RoleType.RESTAURANT)
  @ApiQuery({
    name: 'index', 
    type: Number,
    example: 0,
  })
  @Patch('categories/update')
  updateCategories(@Req() req: RequestWithUser, @Body() body: UpdateItemsRestaurantDto, @Query() query: {index: number}) {
    if (query.index === undefined || query.index === null || query.index < 0) {
      throw new BadRequestException('index is required and must be a positive number');
    }
    return this.restaurantService.updateCategories(req.user.role_id.restaurant, body, query.index);
  }

  @Roles(RoleType.RESTAURANT)
  @Post('categories/add')
  addCategory(@Req() req: RequestWithUser, @Body() body: CreateRestaurantCategoryDto) {
    try {
      // return this.restaurantService.addCategory(req.user.role_id.restaurant, body);
    } catch (error) {
      return error;
    }
  }

  @Roles(RoleType.RESTAURANT)
  @Post('status')
  updateActiveStatus(@Req() req: RequestWithUser, @Body() body: {status: boolean}) {
    try {
      // this.eventEmitter.emit('restaurant.open', req.user.role_id.restaurant)
    } catch (error) {
      return error;
    }
  }

  @Roles(RoleType.RESTAURANT)
  @Get('orders')
  async getAllOrders(@Req() req: RequestWithUser) {
    try {
      let orders = await this.orderService.findOrderByRestaurantId(req.user.role_id.restaurant)
      return orders;
    } catch (error) {
      return error;
    }
  }

  @Roles(RoleType.RESTAURANT)
  @Get('order/accept/:order_id')
  async acceptOrder(@Req() req: RequestWithUser, @Param('order_id') order_id: string) {
    try {
      let order = await this.orderService.DeliveryOrderStatusChange(order_id, OrderStatus.ALLOCATING)
      if(order){
        this.eventEmitter.emit('order.food.allocating', order)
      }
      return order;
    } catch (error) {
      return error;
    }
  }

  @Roles(RoleType.RESTAURANT)
  @Post('order/verify-otp')
  async verifyOTP(@Body() body: {order_id: string, otp: string}) {
    try {
      let result = await this.orderService.verifyOtp(body.order_id, body.otp)
      let order = await this.orderService.findOrderById(body.order_id)
      if(result == OTPVerifyStatus.SUCCESS){
        let newOrder =  await this.orderService.DeliveryOrderStatusChange(body.order_id, OrderStatus.DROPPING_OFF, order.driver_id)
        this.eventEmitter.emit('order.droppingoff', newOrder)
        return newOrder;
      }
      else return {
        message: result
      };
    } catch (error) {
      return error;
    }
  }
}
