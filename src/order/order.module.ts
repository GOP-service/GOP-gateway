import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.schema';
import { DeliveryOrder, DeliveryOrderSchema } from './entities/delivery_order.schema';
import { TransportOrder, TransportOrderSchema } from './entities/transport_order.schema';
import { VietMapModule } from 'src/utils/map-api/viet-map.module';


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
    ]),
    VietMapModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
