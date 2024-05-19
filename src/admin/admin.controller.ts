import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PaymentService } from 'src/payment/payment.service';
import { IAdminController, ICampaign } from 'src/utils/interfaces';
import { AuthService } from 'src/auth/auth.service';
import { RoleType } from 'src/utils/enums';

@Controller('admin')
export class AdminController implements IAdminController, ICampaign{
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly paymentService: PaymentService
  ) {}

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
