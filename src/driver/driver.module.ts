import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { DriverSchema } from './entities/driver.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Driver',schema: DriverSchema, },
    ]),
  ],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
