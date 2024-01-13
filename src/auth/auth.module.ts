import { Module, Res } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthController } from './auth.controller';
import { AccountSchema } from './entities/account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from 'src/customer/customer.module';
import { DriverModule } from 'src/driver/driver.module';
import { JwtModule } from '@nestjs/jwt';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Account',schema: AccountSchema, },
    ]),
    JwtModule.register({}),
    CustomerModule,
    DriverModule,
    RestaurantModule,
  ],
  controllers: [AuthController],
  providers: [
    AccountService,
    AccessTokenStrategy,
    RefreshTokenStrategy, 
  ],
})
export class AuthModule {}
