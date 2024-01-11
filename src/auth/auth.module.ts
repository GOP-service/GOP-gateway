import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthController } from './auth.controller';
import { AccountSchema } from './entities/account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from 'src/customer/customer.module';
import { DriverModule } from 'src/driver/driver.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Account',schema: AccountSchema, },
    ]),
    JwtModule.register({}),
    CustomerModule,
    DriverModule,

  ],
  controllers: [AuthController],
  providers: [AccountService],
})
export class AuthModule {}
