import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VietMapModule } from 'src/utils/map-api/viet-map.module';
import { FoodItemsSchema, OrderFoodItems } from './entities/order_food_items.schema';
import { Otp, OtpSchema } from 'src/auth/entities/otp.schema';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentModule } from 'src/payment/payment.module';
import { Order, OrderSchema } from './entities/order.schema';
import { DeliveryOrder, DeliveryOrderSchema } from './entities/delivery_order.schema';
import { TransportOrder, TransportOrderSchema } from './entities/transport_order.schema';
import { SocketModule } from 'src/socket/socket.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Order.name, 
        schema: OrderSchema,
        discriminators: [
          { name: DeliveryOrder.name, schema: DeliveryOrderSchema },
          { name: TransportOrder.name, schema: TransportOrderSchema },
        ]
      },
      { name: OrderFoodItems.name, schema: FoodItemsSchema },
    ]),
    PaymentModule,
    VietMapModule,
    SocketModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
