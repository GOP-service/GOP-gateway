import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { OTPType, OTPVerifyStatus, OrderStatus, RoleType } from 'src/utils/enums';
import { AuthService } from 'src/auth/auth.service';
import { ICampaign, IRestaurantController, RequestWithUser } from 'src/utils/interfaces';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';
import { UpdateItemsRestaurantDto } from './dto/update-item-restaurant-category.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderService } from 'src/order/order.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FoodItemDto } from './dto/food-item.dto';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { RestaurantCategoryService } from './restaurant_category.service';
import { UpdateRestaurantCategoryDto } from './dto/update-restaurant-category.dto';


@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'),RolesGuard)
@ApiTags('Restaurants')
@Controller('restaurant')
export class RestaurantController implements IRestaurantController, ICampaign{
  constructor(
    private readonly orderService: OrderService,
    private readonly restaurantService: RestaurantService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('profile')
  getProile(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Roles(RoleType.RESTAURANT)
  @Patch('info/update')
  async updateRestaurant(@Req() req: RequestWithUser, @Body() body: UpdateRestaurantDto): Promise<any> {
    try {
      const restaurant = await this.restaurantService.updateRestaurant(req.user.sub, body);
      return restaurant;
    } catch (error) {
      return error
    }
  }

  @Post('order/:id/accept')
  acceptOrder(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('order/:id/reject')
  rejectOrder(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('order/:id/details')
  getOrderDetails(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('orders')
  getOrders(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Delete('order/:id/delete')
  deleteOrder(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('/statistics/revenue')
  getRevenueStatistics(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('category/create')
  createCategory(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Patch('catrgory/:id/update')
  updateCategory(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Delete('category/:id/delete')
  deleteCategory(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('fooditem/create')
  createFoodItem(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Patch('fooditem/:id/update')
  updateFoodItem(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Delete('fooditem/:id/delete')
  deleteFoodItem(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('campaigns')
  getCampaigns(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('campaign/:id')
  getCampaignDetails(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('campaign/create')
  createCampaign(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Patch('campaign/:id/update')
  updateCampaign(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Delete('campaign/:id/delete')
  deleteCampaign(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  
  // RESTAURANT
  // @Roles(RoleType.RESTAURANT)
  // @Patch('info/update')
  // async updateRestaurant(@Req() req: RequestWithUser, @Body() body: UpdateRestaurantDto){
  //   try {
  //     const restaurant = await this.restaurantService.updateRestaurant(req.user.sub, body);
  //     return restaurant;
  //   } catch (error) {
  //     return error
  //   }
  // }

  // CATEGORY
  // @Roles(RoleType.RESTAURANT)
  // @Post('category')
  // async createCategory(@Req() req: RequestWithUser, @Body() body: CreateRestaurantCategoryDto){
  //   try {
  //     const restaurant = await this.restaurantService.addCategory(req.user.sub, body)
  //     return restaurant;
  //   } catch (error) {
  //     return error
  //   }
  // }

  // @Roles(RoleType.RESTAURANT)
  // @Patch('category')
  // async updateCategory(@Req() req: RequestWithUser, @Body() body: UpdateRestaurantCategoryDto){
  //   try {
  //     const restaurant = await this.restaurantService.updateCategory(req.user.sub, body)
  //     return restaurant;
  //   } catch (error) {
  //     return error
  //   }
  // }

  // FOOD ITEM
  // @Roles(RoleType.RESTAURANT)
  // @Post('fooditem')
  // async createFoodItem(@Req() req: RequestWithUser, @Body() body: CreateFoodItemDto){
  //   try {
  //     const restaurant = await this.restaurantService.createFoodItem(req.user.sub, body);
  //     return restaurant;
  //   } catch (error) {
  //     return error
  //   }
  // }

  // @Roles(RoleType.RESTAURANT)
  // @Get('info')
  // info(@Req() req: RequestWithUser) {
  //   return this.restaurantService.findOneId(req.user.role_id.restaurant);
  // }
  
  // @Roles(RoleType.RESTAURANT)
  // @ApiQuery({
  //   name: 'index', 
  //   type: Number,
  //   example: 0,
  // })
  // @Patch('categories/update')
  // updateCategories(@Req() req: RequestWithUser, @Body() body: UpdateItemsRestaurantDto, @Query() query: {index: number}) {
  //   if (query.index === undefined || query.index === null || query.index < 0) {
  //     throw new BadRequestException('index is required and must be a positive number');
  //   }
  //   return this.restaurantService.updateCategories(req.user.role_id.restaurant, body, query.index);
  // }

  // @Roles(RoleType.RESTAURANT)
  // @Post('categories/create')
  // addCategory(@Req() req: RequestWithUser, @Body() body: CreateRestaurantCategoryDto) {
  //   try {
  //     const category = this.restaurantService.createCategory(req.user.role_id.restaurant, body);
  //     return category;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // @Roles(RoleType.RESTAURANT)
  // @Post('status')
  // updateActiveStatus(@Req() req: RequestWithUser, @Body() body: {status: boolean}) {
  //   try {
  //     // this.eventEmitter.emit('restaurant.open', req.user.role_id.restaurant)
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // @Roles(RoleType.RESTAURANT)
  // @Get('orders')
  // async getAllOrders(@Req() req: RequestWithUser) {
  //   try {
  //     let orders = await this.orderService.findOrderByRestaurantId(req.user.role_id.restaurant)
  //     return orders;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // @Roles(RoleType.RESTAURANT)
  // @Get('order/accept/:order_id')
  // async acceptOrder(@Req() req: RequestWithUser, @Param('order_id') order_id: string) {
  //   try {
  //     let order = await this.orderService.DeliveryOrderStatusChange(order_id, OrderStatus.ALLOCATING)
  //     if(order){
  //       this.eventEmitter.emit('order.food.allocating', order)
  //     }
  //     return order;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // @Roles(RoleType.RESTAURANT)
  // @Post('order/verify-otp')
  // async verifyOTP(@Body() body: {order_id: string, otp: string}) {
  //   try {
  //     let result = await this.orderService.verifyOtp(body.order_id, body.otp)
  //     let order = await this.orderService.findOrderById(body.order_id)
  //     if(result == OTPVerifyStatus.SUCCESS){
  //       let newOrder =  await this.orderService.DeliveryOrderStatusChange(body.order_id, OrderStatus.DROPPING_OFF, order.driver_id)
  //       this.eventEmitter.emit('order.droppingoff', newOrder)
  //       return newOrder;
  //     }
  //     else return {
  //       message: result
  //     };
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // @Roles(RoleType.RESTAURANT)
  // @UseInterceptors(FileInterceptor('file'))
  // @Patch('update/avatar')
  // async updateAvatar(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
  //   try {
  //     if (!file) {
  //       throw new BadRequestException('file is required');
  //     }
  //     return this.restaurantService.updateAvatar(req.user.role_id.restaurant, file)
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // @Roles(RoleType.RESTAURANT)
  // @UseInterceptors(FileInterceptor('image'))
  // @Post('create/food-item')
  // async createFoodItem(@Req() req: RequestWithUser, @Body() body: CreateFoodItemDto, @UploadedFile() image){
  //   try {
  //     return this.restaurantService.createFoodItem(req.user.role_id.restaurant, body, image)
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // @Roles(RoleType.RESTAURANT)
  // @Get('menu')
  // async getRestaurantMenu(@Req() req: RequestWithUser){
  //   try {
  //     return this.restaurantService.fetchRestaurantMenu(req.user.role_id.restaurant)
  //   } catch (error) {
  //     return error
  //   }
  // }
}
