import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PaymentService } from 'src/payment/payment.service';
import { IAdminController, ICampaign } from 'src/utils/interfaces';
import { AuthService } from 'src/auth/auth.service';
import { RoleType } from 'src/utils/enums';
import { CustomerService } from 'src/customer/customer.service';
import { OrderService } from 'src/order/order.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Controller('api/v1/admin')
export class AdminController implements IAdminController, ICampaign{
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly paymentService: PaymentService,
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly restaurantService: RestaurantService
    
  ) {}
  getRevenueStatistics(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get(':id/categories')
  async fetchCategoriesByCustomer(@Param('id') id: string) {
    try {
      const categories = await this.restaurantService.findCategoriesByCustomer(id);
      return categories;
    } catch (error) {
      throw new Error('Failed')
    }
  }

  @Get('fooditems')
  async fetchFoodItems(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Query('category_id') category_id?: string) {
    return await this.restaurantService.getFoodItems(page, limit, category_id);
  }



  @Get('customer/:id/order-history')
  async OrderHistoryByCustomerId(@Param('id') id: string) {
    return await this.orderService.findCusOrderHistoryByAdmin(id)
  }

  @Get('customer/:id/details')
  async fetchCustomerDetails(@Param('id') id: string) {
    return await this.customerService.findOneById(id);
  }

  @Get('customers')
  fetchAccounts() {
    return this.adminService.findAllCustomer();
  }

  @Patch('change-account-status')
  changeAccountVerifyStatus(@Body() body: {
    verified: boolean, _id: string
  }) {
    return this.adminService.changeAccVerifyStatus(body.verified, body._id)
  }

  @Get('campaigns')
  getCampaigns(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get(':id/campaigns')
  getCampaignsByOwnerId(@Param('id') id: string): Promise<any> {
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

  @Get('customers')
  getCustomers(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('customer/:id/info')
  getCustomerInfo(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('customers/search')
  searchCustomers(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('customer/:id/block')
  blockCustomer(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('drivers')
  getDrivers(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('driver/:id/info')
  getDriverInfo(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('drivers/search')
  searchDrivers(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('driver/:id/block')
  blockDriver(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('restaurants')
  getRestaurants(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('restaurant/:id/info')
  getRestaurantInfo(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('restaurant/search')
  searchRestaurants(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('statistics/restaurants')
  getRestaurantStatistics(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('statistics/restaurant/:id')
  getStatisticsByRestaurant(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('restaurant/:id/block')
  blockRestaurant(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('orders')
  getOrders(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('orders/search')
  searchOrders(): Promise<any> {
    throw new Error('Method not implemented.');
  }


}
