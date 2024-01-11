import { INestApplication, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { DriverModule } from './driver/driver.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { BillModule } from './bill/bill.module';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AzureStorageModule } from './utils/auzre/storage-blob.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(
      {
        wildcard: true,
        delimiter: '.',
        maxListeners: 10,
        verboseMemoryLeak: true,
        ignoreErrors: false,
      }
    ),
    AuthModule,
    CustomerModule, 
    DriverModule, 
    RestaurantModule, 
    BillModule, 
    OrderModule,
    AzureStorageModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  static port: number | string;

  constructor(private configService: ConfigService) {
    AppModule.port = configService.get<string>('PORT') || 8080;
  }

  static getBaseUrl(app: INestApplication): string {
    let baseUrl = app.getHttpServer().address().address;
    if (baseUrl == '0.0.0.0' || baseUrl == '::') {
        return (baseUrl = 'localhost');
    }
  }
}
