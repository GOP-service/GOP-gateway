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

  @Post('vnpay')
  async getVnpayLink(@Req() req: RequestWithUser, @Ip() ip: string, @Body() body: { amount: number, returnUrl: string }){
    try {
      return this.paymentService.getURLVnPay(ip, body.amount, new Date().getTime().toString(), body.returnUrl);
    } catch (e) {
      return e;
    }
  }
}
