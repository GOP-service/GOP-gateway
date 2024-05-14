import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    PaymentModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
