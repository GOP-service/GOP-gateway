import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { OTPType, OTPVerifyStatus, OrderStatus, RestaurantStatus, RoleType } from 'src/utils/enums';
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
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { PaymentService } from 'src/payment/payment.service';
import { CreateCampaignDto } from 'src/payment/dto/create-campaign.dto';
import { UpdateCampaignnDto } from 'src/payment/dto/update-campaign.dto';
import { ReviewDto } from './dto/review.dto';
import e from 'express';


@ApiBearerAuth()
@ApiTags('Restaurants')
@Controller('restaurant')
export class RestaurantController implements IRestaurantController, ICampaign{
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly eventEmitter: EventEmitter2,
    private readonly paymentService: PaymentService
  ) {}
  
  getProfile(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updateProfile(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  createMenu(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updateMenu(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  deleteMenu(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  createPromotion(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updatePromotion(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  deletePromotion(): Promise<any> {
    throw new Error('Method not implemented.');
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.CUSTOMER)
  @Post('review')
  async createRestaurantReview(@Body() body: ReviewDto) {
    try {
      return await this.restaurantService.createReview(body);
    } catch (error) {
      throw new Error("create review failed")
    }
  }

  @Get(':id/reviews')
  async findReviewsByResId(@Param('id') id: string){
    try {
      const reviews = await this.restaurantService.getReivewsByRes(id);
      return reviews;
    } catch (error) {
      throw new Error(error) 
    }
  }


  @Post('info/:id')
  fetchInfoByCustomer(@Param('id') id: string, @Body() body: { coordinates: number[] }) {
    return this.restaurantService.getInfoByCustomer(id, body.coordinates);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Get('info')
  fetchInfo(@Req() req: RequestWithUser) {
    return this.restaurantService.getInfo(req.user.sub);
  }

  @Get('menu/:id')
  async fetchMenu(@Param('id') id?: string) {
    return await this.restaurantService.getMenu(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Get('menu')
  async fetchMenuByRes(@Req() req: RequestWithUser) {
    return await this.restaurantService.getMenu(req.user.sub);
  }

  @Post('recommended')
  async getRestaurants(@Body() body:  { coordinates: number[] }) {
    const res = await this.restaurantService.getRestaurantsByCustomer(body.coordinates);
    return res;
  }

  @Get('profile')
  getProile(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
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

  @Roles(RoleType.RESTAURANT)
  @Post('order/:id/accept')
  acceptOrder(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Roles(RoleType.RESTAURANT)
  @Post('order/:id/reject')
  rejectOrder(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Roles(RoleType.RESTAURANT)
  @Post('order/:id/details')
  getOrderDetails(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Roles(RoleType.RESTAURANT)
  @Get('orders')
  getOrders(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Roles(RoleType.RESTAURANT)
  @Delete('order/:id/delete')
  deleteOrder(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Roles(RoleType.RESTAURANT)
  @Get('/statistics/revenue')
  getRevenueStatistics(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Get('category')
  fetchCategory(@Req() req: RequestWithUser) {
    return this.restaurantService.findCategoryByRestaurant(req.user.sub)
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Post('category/create')
  async createCategory(@Req() req: RequestWithUser, @Body() body: CreateRestaurantCategoryDto): Promise<any> {
    try {
      const restaurant = await this.restaurantService.addCategory(req.user.sub, body)
      return restaurant;
    } catch (error) {
      return error
    }
  }

  @Roles(RoleType.RESTAURANT)
  @Post('category/:id/update-image')
  @UseInterceptors(FileInterceptor('image'))
  updateCategoryImage(@Param('id') cate_id: string, @UploadedFile() image: Express.Multer.File) {
    const uploadImage = this.restaurantService.updateCategoryImg(cate_id, image);
    return uploadImage;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Patch('category/:id/update')
  async updateCategory(@Req() req: RequestWithUser, @Param('id') id: string, @Body() body: UpdateRestaurantCategoryDto): Promise<any> {
     try {
      const restaurant = await this.restaurantService.updateCategory(req.user.sub, id, body)
      return restaurant;
    } catch (error) {
      return error
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Delete('category/:id/delete')
  async deleteCategory(@Req()  req: RequestWithUser, @Param('id') id: string): Promise<any> {
    try {
      const category = await this.restaurantService.
      deleteCategory(id, req.user.sub)
      return category;
    } catch (error) {
      return error
    }
  }

  @Get('fooditem/:id')
  async fetchFoodDetails(@Param('id') id: string) {
    const foodItem = await this.restaurantService.getFooditemDetails(id)
    return foodItem
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Post('fooditem/create')
  async createFoodItem(@Req() req: RequestWithUser, @Body() body: CreateFoodItemDto): Promise<any> {
    try {
      const foodItem = await this.restaurantService.createFoodItem(req.user.sub, body);
      return foodItem;
    } catch (error) {
      return error
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Patch('fooditem/update')
  async updateFoodItem(@Body() body: UpdateFoodItemDto): Promise<any> {
    return await this.restaurantService.updateFoodItem(body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Post('fooditem/:id/update-image')
  @UseInterceptors(FileInterceptor('image'))
  updateFoodItemImage(@Param('id') food_item_id: string, @UploadedFile() image: Express.Multer.File) {
    const uploadImage = this.restaurantService.updateFoodItemImg(food_item_id, image);
    return uploadImage;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Post('fooditem/delete')
  async deleteFoodItem(@Req() req: RequestWithUser, @Body() body: { category_id: string, foodItem_id: string }): Promise<any> {
    try {
      const foodItems = await this.restaurantService.deleteFoodItem(req.user.sub, body.category_id, body.foodItem_id);
      return foodItems;
    } catch (error) {
      throw new Error('Delete fooditem failed');
    }
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  updateAvatar(@UploadedFile() image: Express.Multer.File) {
    try {
      if (!image) {
        throw new BadRequestException('file is required');
      }
      return this.restaurantService.updateFoodItemImg('6647a4011216ae8cfd4a9c21', image)
    } catch (error) {
      return error;
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Get('campaigns')
  getCampaigns(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Roles(RoleType.RESTAURANT)
  @Get(':id/campaigns')
  async getCampaignsByOwnerId(@Param('id') id: string): Promise<any> {
    return await this.paymentService.getCampaignByOwnerId(id); 
  }

  @Roles(RoleType.RESTAURANT)
  @Get('campaign/:id')
  getCampaignDetails(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Post('campaign/create')
  async createCampaign(@Body() body: CreateCampaignDto): Promise<any> {
    return await this.paymentService.createCampaign(body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Patch('campaign/update')
  async updateCampaign(@Body() body: UpdateCampaignnDto): Promise<any> {
    try {
      return await this.paymentService.updateCampaign(body);
    } catch (error) {
      throw new Error('Update campaign failed!')
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Delete('campaign/:id/delete')
  async deleteCampaign(@Param('id') id: string, @Req() req: RequestWithUser): Promise<any> {
    try {
      return await this.paymentService.deleteCampaign(id, req.user.sub)
    } catch (error) {
      throw new Error('Delete campaign failed')
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.RESTAURANT)
  @Patch('status')
  updateActiveStatus(@Req() req: RequestWithUser, @Body() body: { status: RestaurantStatus }) {
    return this.restaurantService.updateActiveStatus(req.user.sub, body.status);
  }
  
  // RESTAURANT

  // FOOD ITEM

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
