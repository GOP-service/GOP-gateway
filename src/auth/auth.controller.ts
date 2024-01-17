import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, InternalServerErrorException, BadRequestException, Req, UseGuards, Logger, UnauthorizedException } from '@nestjs/common';
import { AccountService } from './account.service';
import { CustomerService } from 'src/customer/customer.service';
import { DriverService } from 'src/driver/driver.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { RoleType } from 'src/utils/enums';
import { SigninDto, SignupCustomerDto, SignupDriverDto, SignupRestaurantDto } from './dto';
import { RequestWithUser } from 'src/utils/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { DriverProfile } from 'src/driver/entities/driver_profile.schema';
import { RestaurantProfile } from 'src/restaurant/entities/restaurant_profile.schema';

@ApiBearerAuth()
@ApiTags('Authentications')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
    private readonly driverService: DriverService,
    private readonly restaurantService: RestaurantService,
  ) {}

  logger = new Logger('AuthController'); 
  
  // * CUSTOMER
  @Post('customer/signup')
  async createCustomer(@Body() body: SignupCustomerDto) {
    const checkExist = await this.accountService.findOnePhone(body.phone);
    if (checkExist) {
      // account đã tồn tại nên chỉ update role và tạo customer

      if (checkExist.role[RoleType.CUSTOMER] !== '') {
        throw new ConflictException('This phone number is already registered as Customer');
      }

      const newCustomer = await this.customerService.create({
        account: checkExist,
        full_name: body.full_name,
      });
      
      await this.accountService.updateRole(checkExist._id, RoleType.CUSTOMER, newCustomer._id);
      
      const token = await this.accountService.updateRefreshToken(checkExist._id, checkExist.toObject().role);
      
      return token;
    } else { 
      // account chưa tồn tại nên tạo mới
      const newAccount = await this.accountService.create({
        phone: body.phone,
        password: body.password,
      });

      const newCustomer = await this.customerService.create({
        account: newAccount,
        full_name: body.full_name,
      });

      await this.accountService.updateRole(newAccount._id, RoleType.CUSTOMER, newCustomer._id);

      return await this.accountService.updateRefreshToken(newAccount._id, newAccount.toObject().role);
    }
  }

  @Post('customer/signin')
  async signinCustomer(@Body() body: SigninDto ) {
    const account = await this.accountService.checkPassword_Phone(body.phone, body.password);
    if (!account) {
      throw new BadRequestException('Password is incorrect or phone number does not exist');
    }

    if (account.role[RoleType.CUSTOMER] === '') {
      throw new BadRequestException('This phone number is not registered as customer');
    }

    const token = await this.accountService.updateRefreshToken(account._id, account.toObject().role);
    return token;
  }

  // ! RolesGuard TEST
  @Roles(RoleType.CUSTOMER)
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Get('customer/me')
  async getMe(@Req() req: RequestWithUser) {
    const customer = await this.accountService.findOneId(req.user['sub']);
    return customer;
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('customer/refresh')
  async refreshCustomer(@Req() req: RequestWithUser) {
    const token = await this.accountService.check_updateRefreshToken(req.user.sub, req.user.role_id, req.user.refreshToken);
    if (!token) {
      throw new UnauthorizedException('Refresh token is incorrect, please login again');
    } 
    return token;
  }
  
  // * DRIVER
  
  // todo: up ảnh 
  @Post('driver/signup')
  async createDriver(@Body() body: SignupDriverDto) {
    const checkExist = await this.accountService.findOnePhone(body.phone);
    if (checkExist) {
      // account đã tồn tại nên chỉ update role và tạo driver

      if (checkExist.role[RoleType.DRIVER] !== '') {
        throw new ConflictException('This phone number is already registered as Driver');
      }

      // todo: xử lí nhét anh ở đây
      const profile = new DriverProfile();
      profile.vehicle_image = 'link ảnh';

      const newDriver = await this.driverService.create({
        full_name: body.full_name,
        vehicle_type: body.vehicle_type,
        vehicle_model: body.vehicle_model,
        vehicle_plate_number: body.vehicle_plate_number,
        profile: profile,
      });
      
      await this.accountService.updateRole(checkExist._id, RoleType.DRIVER, newDriver._id);
      
      return await this.accountService.updateRefreshToken(checkExist._id, checkExist.toObject().role);
      
    } else { 
      // account chưa tồn tại nên tạo mới
      const newAccount = await this.accountService.create({
        phone: body.phone,
        password: body.password,
      });

      // todo: xử lí nhét anh ở đây
      const profile = new DriverProfile();
      profile.vehicle_image = 'link ảnh';

      const newDriver = await this.driverService.create({
        full_name: body.full_name,
        vehicle_type: body.vehicle_type,
        vehicle_model: body.vehicle_model,
        vehicle_plate_number: body.vehicle_plate_number,
        profile: profile,
      });

      await this.accountService.updateRole(newAccount._id, RoleType.DRIVER, newDriver._id);

      return await this.accountService.updateRefreshToken(newAccount._id, newAccount.toObject().role);
    }
  }

  @Post('driver/signin')
  async signinDriver(@Body() body: SigninDto ) {
    const account = await this.accountService.checkPassword_Phone(body.phone, body.password);
    if (!account) {
      throw new BadRequestException('Password is incorrect or phone number does not exist');
    }

    if (account.role[RoleType.DRIVER] === '') {
      throw new BadRequestException('This phone number is not registered as driver');
    }

    const token = await this.accountService.updateRefreshToken(account._id, account.toObject().role);
    return token;
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('driver/refresh')
  async refreshDriver(@Req() req: RequestWithUser) {
    const token = await this.accountService.check_updateRefreshToken(req.user.sub, req.user.role_id, req.user.refreshToken);
    if (!token) {
      throw new UnauthorizedException('Refresh token is incorrect, please login again');
    } 
    return token;
  }

  // * RESTAURANT
  @Post('restaurant/signup')
  async createRestaurant(@Body() body: SignupRestaurantDto) {
    const checkExist = await this.accountService.findOnePhone(body.phone);
    if (checkExist) {
      // account đã tồn tại nên chỉ update role và tạo restaurant

      if (checkExist.role[RoleType.RESTAURANT] !== '') {
        throw new ConflictException('This phone number is already registered as Restaurant');
      }
      
      // todo: xử lí nhét anh ở đây
      const profile = new RestaurantProfile();
      profile.license_image = 'link ảnh';

      const newRestaurant = await this.restaurantService.create({
        profile: profile,
        name: body.name,
        address: body.address,
        bio: body.bio,
        cuisine_categories: body.cuisine_categories,
      });

      return await this.accountService.updateRole(checkExist._id, RoleType.RESTAURANT, newRestaurant._id);
    } else {
      // account chưa tồn tại nên tạo mới
      const newAccount = await this.accountService.create({
        phone: body.phone,
        password: body.password,
      });

      //todo: xử lí nhét anh ở đây
      const profile = new RestaurantProfile();
      profile.license_image = 'link ảnh';

      const newRestaurant = await this.restaurantService.create({
        profile: profile,
        name: body.name,
        address: body.address,
        bio: body.bio,
        cuisine_categories: body.cuisine_categories,
      });

      await this.accountService.updateRole(newAccount._id, RoleType.RESTAURANT, newRestaurant._id);

      return await this.accountService.updateRefreshToken(newAccount._id, newAccount.toObject().role);
    }
  }

  @Post('restaurant/signin')
  async signinRestaurant(@Body() body: SigninDto ) {
    const account = await this.accountService.checkPassword_Phone(body.phone, body.password);
    if (!account) {
      throw new BadRequestException('Password is incorrect or phone number does not exist');
    }

    if (account.role[RoleType.RESTAURANT] === '') {
      throw new BadRequestException('This phone number is not registered as restaurant');
    }

    const token = await this.accountService.updateRefreshToken(account._id, account.toObject().role);
    return token;
  }


}
