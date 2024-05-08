import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Ip } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { VnpayService } from 'src/utils/vnpay-payment/vnpay.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { log } from 'console';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

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

  @Post('promotion')
  async createPromotion(@Body() body: CreatePromotionDto){
    return this.paymentService.createPromotion(body)
  }

  @Delete('promotion/:id')
  async deletePromotion(@Param('id') id: string){
    return this.paymentService.deletePromotion(id)
  }

  @Patch('promotion/state')
  async updatePromotion(@Body() body: UpdatePromotionDto){
    try {
      const promo = await this.paymentService.updatePromotion(body)
      return promo
    } catch (error) {
      return error
    }
  }
}
