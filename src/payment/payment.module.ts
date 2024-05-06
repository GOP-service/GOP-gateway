import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Bill, BillSchema } from './entities/bill.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VnpayModule } from 'src/utils/vnpay-payment/vnpay.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bill.name, schema: BillSchema, },
    ]),
    VnpayModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
