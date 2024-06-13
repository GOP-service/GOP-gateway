import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, InternalServerErrorException, Res } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { PaymentMethod, RoleType } from 'src/utils/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderService } from 'src/order/order.service';
import { CreateTransportOrderDto } from 'src/order/dto/create-transport-order';
import { ICampaign, ICustomerController, RequestWithUser } from 'src/utils/interfaces';
import { CreateDeliveryOrderDto } from 'src/order/dto/create-delivery-order';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { PaymentService } from 'src/payment/payment.service';
import { ApplyCampaignDto } from 'src/payment/dto/apply-campaign.dto';
import { error } from 'console';
import e, { Response } from 'express';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'),RolesGuard)
@ApiTags('Customer')
@Controller('customer')
@Roles(RoleType.CUSTOMER)
export class CustomerController implements ICustomerController, ICampaign {
  constructor(
    private readonly customerService: CustomerService,
    private readonly paymentService: PaymentService
  ) {}

  // CAMPAIGNS
  @Get('campaigns')
  async getCampaigns(): Promise<any> {
    const campaigns = await this.paymentService.getAllCampaign();
    if(campaigns) 
      return campaigns;
    throw new Error('No campaigns found');
  }
  getCampaignDetails(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  createCampaign(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updateCampaign(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  deleteCampaign(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  
  // ACCOUNT MANAGEMT
  @Get('profile')
  async getProfile(@Req() req: RequestWithUser, @Res() res: Response) {
    return await this.customerService.findOneById(req.user.sub).then(profile => {
      if (profile) {
        return res.status(200).json({
          _id: profile._id,
          email: profile.email,
          full_name: profile.full_name,
          phone: profile.phone,
          gender: profile.gender,
          address: profile.address,
          avatar: profile.avatar,
        }) 
      } else {
        return res.status(404).json({message: 'Profile not found'})
      }
    });
  }

  @Patch('profile')
  async modifyProfile(@Req() req: RequestWithUser, @Res() res: Response) {
    return;
  }

  
  @Post('review')
  async createReview(@Req() req: RequestWithUser, @Body() dto: any) {
    
  }

  @Delete('review/:id')
  async deleteReview(@Req() req: RequestWithUser,@Param() id: any, @Res() res: Response,) {
    
  }

}
