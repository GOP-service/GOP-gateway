import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PaymentModule } from 'src/payment/payment.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    PaymentModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
