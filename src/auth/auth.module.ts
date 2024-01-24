import { Module, Res } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthController } from './auth.controller';
import { Account, AccountSchema } from './entities/account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from 'src/customer/customer.module';
import { DriverModule } from 'src/driver/driver.module';
import { JwtModule } from '@nestjs/jwt';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { Otp, OtpSchema } from './entities/otp.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema, },
      { name: Otp.name, schema: OtpSchema,}
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
  exports: [AccountService],
})
export class AuthModule {}
