import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Ip } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/utils/interfaces';

@ApiTags('Bill')
@Controller('bill')
export class PaymentController{
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Get('vnpay')
  async getVnpayLink(@Req() req: RequestWithUser, @Ip() ip: string){
    try {
      return this.paymentService.getURLVnPay(ip, 100000, new Date().getTime().toString());
    } catch (e) {
      return e;
    }
  }
}
