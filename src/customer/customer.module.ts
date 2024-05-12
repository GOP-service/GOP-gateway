import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer, CustomerSchema } from './entities/customer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from 'src/order/order.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { PaymentModule } from 'src/payment/payment.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema, },
    ]),
    OrderModule,
    RestaurantModule,
    PaymentModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
