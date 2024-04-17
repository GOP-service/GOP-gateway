import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { CustomerModule } from 'src/customer/customer.module';
import { DriverModule } from 'src/driver/driver.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { OrderModule } from 'src/order/order.module';

@Module({
    imports: [
        CustomerModule,
        DriverModule,
        RestaurantModule,
        OrderModule,
    ],
    providers: [SocketGateway],
})
export class SocketModule {}
