import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { AccountService } from './account.service';
import { CustomerService } from 'src/customer/customer.service';
import { DriverService } from 'src/driver/driver.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { SignupCustomerDto } from './dto/signup-customer.dto';
import { CreateAccountDto } from './dto/create-acc.dto';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';
import { Role } from './entities/role.schema';
import { RoleType } from 'src/utils/enums';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
    private readonly driverService: DriverService,
    private readonly restaurantService: RestaurantService,
  ) {}
  
  @Post('customer/signup')
  async createCustomer(@Body() body: SignupCustomerDto) {
    if (!this.accountService.findOnePhone(body.phone, RoleType.CUSTOMER)) {
      new ConflictException('Phone number already exists');
    }

    try {
      const customerDto : CreateCustomerDto = {
        full_name: body.full_name
      }
  
      const customer = await this.customerService.create(customerDto);
  
  
  
      const accountDto : CreateAccountDto = {
        phone: body.phone,
        password: body.password,
      };
      
      const account = await this.accountService.create(accountDto);

      let role = account.role;

      role.customer = customer._id;


      
      const token = await this.accountService.getTokens(account._id, RoleType.CUSTOMER);

      await this.accountService.updateRefreshToken(account.phone, token.refreshToken);

      return token;

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('customer/signin')
  async signinCustomer(@Body() body: SignupCustomerDto, ) {
    const account = await this.accountService.checkPassword_Phone(body.phone, body.password);
    if (!account) {
      throw new BadRequestException('Password is incorrect or phone number does not exist');
    }
    try {
      const token = await this.accountService.getTokens(account._id, RoleType.CUSTOMER);

      await this.accountService.updateRefreshToken(account.phone, token.refreshToken);
  
      return token;

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}
