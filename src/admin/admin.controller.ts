import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PaymentService } from 'src/payment/payment.service';
import { CreatePromotionDto } from 'src/payment/dto/create-promotion.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly paymentService: PaymentService
  ) {}

  @Post('promotion')
  createPromotion(@Body() body: CreatePromotionDto){
    const promo = this.paymentService.createPromotion(body)
    return promo;
  }


}
