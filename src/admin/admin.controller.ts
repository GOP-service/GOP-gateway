import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PaymentService } from 'src/payment/payment.service';
import { CreatePromotionDto } from 'src/payment/dto/create-promotion.dto';
import { AuthService } from 'src/auth/auth.service';
import { RoleType } from 'src/utils/enums';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly paymentService: PaymentService
  ) {}

  @Post('promotion')
  createPromotion(@Body() body: CreatePromotionDto){
    const promo = this.paymentService.createPromotion(body)
    return promo;
  }

  @Post('signin')
  signIn(@Body() body: any){
    const token = this.authService.getTokens('1', RoleType.ADMIN)
    return token;
  }

}
