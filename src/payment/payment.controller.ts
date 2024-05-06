import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Ip } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { VnpayService } from 'src/utils/vnpay-payment/vnpay.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bill')
@Controller('bill')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly vnpayService: VnpayService,
  ) {}


  @Get()
  findAll(@Req() req) {

  }

  
}
