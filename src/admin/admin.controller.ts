import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PaymentService } from 'src/payment/payment.service';
import { CreateCampaignDto } from 'src/payment/dto/create-campaign.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly paymentService: PaymentService
  ) {}

  @Post('campaign')
  createCampaign(@Body() body: CreateCampaignDto){
    const campaign = this.paymentService.createCampaign(body)
    return campaign;
  }


}
