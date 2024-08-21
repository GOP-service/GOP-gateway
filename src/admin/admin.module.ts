import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PaymentModule } from 'src/payment/payment.module';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerModule } from 'src/customer/customer.module';
import { OrderModule } from 'src/order/order.module';
import { Restaurant } from 'src/restaurant/entities/restaurant.schema';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [
    AuthModule,
    PaymentModule,
    CustomerModule,
    OrderModule,
    RestaurantModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
