import { INestApplication, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { DriverModule } from './driver/driver.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AzureStorageModule } from './utils/auzre/storage-blob.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { SocketModule } from './socket/socket.module';
import { VietMapModule } from './utils/map-api/viet-map.module';


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
    MailerModule.forRootAsync({
      useFactory: () => ({
          transport: {
              host: 'smtp.nbphuoc.id.vn',
              port: 465,
              secure: true,
              auth: {
                  user: 'nbphuoc@nbphuoc.id.vn',
                  pass: 'kq82h3d6'
              },
          },
          defaults: {
              from: '"GoP Authentication" <nbphuoc@nbphuoc.id.vn>',
          },
      })
  }),
    AuthModule,
    CustomerModule, 
    DriverModule, 
    RestaurantModule, 
    PaymentModule, 
    OrderModule,
    AzureStorageModule,
    AdminModule,
    SocketModule,
    VietMapModule,
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
