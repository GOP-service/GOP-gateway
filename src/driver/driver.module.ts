import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { Driver, DriverSchema } from './entities/driver.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema, },
    ]),
    OrderModule,
  ],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule {}
