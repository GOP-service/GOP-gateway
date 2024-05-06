import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, InternalServerErrorException, BadRequestException, Req, UseGuards, Logger, UnauthorizedException, Res, HttpCode, HttpStatus, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { AccountService } from './account.service';
import { CustomerService } from 'src/customer/customer.service';
import { DriverService } from 'src/driver/driver.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { OTPType, OTPVerifyStatus, RoleType } from 'src/utils/enums';
import { CreateAccountDto, OtpVerifyDto, SigninDto, } from './dto';
import { RequestWithUser } from 'src/utils/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpTemplate } from 'src/utils/mail-template/otp';
import { CreateDriverDto } from 'src/driver/dto/create-driver.dto';
import { CreateRestaurantDto } from 'src/restaurant/dto/create-restaurant.dto';
import { createCustomerDto } from 'src/customer/dto/create-customer.dto';
import { profile } from 'console';

@ApiBearerAuth()
@ApiTags('Authentications')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
    private readonly driverService: DriverService,
    private readonly restaurantService: RestaurantService,
    private readonly mailerService: MailerService,
  ) {}

  logger = new Logger('AuthController'); 

  async sendOTPMail(mail: string, usename: string, otp: string, type: OTPType) {
    return await this.mailerService.sendMail({
      to: mail,
      subject: 'OTP verification',
      text: 'OTP verification',
      html: OtpTemplate(usename,otp,'',type),
    });
  }

  // * SIGN UP ACCOUNT
  @Post('signup')
  async signup(@Body() body: CreateAccountDto, @Res() res: Response) {
    const checkExist = await this.accountService.findOneEmail(body.email);
    if (checkExist) {
      // account đã tồn tại
      throw new ConflictException('This email is already registered');
    } else {
      // account chưa tồn tại nên tạo mới
      const newAccount = await this.accountService.createAccount({
        email: body.email,
        password: body.password,
        full_name: body.full_name,
      });
      if (!newAccount) {
        throw new InternalServerErrorException('Something went wrong');
      }
      const otp = await this.accountService.createOtp(newAccount.id, OTPType.VERIFY_ACCOUNT);
      this.sendOTPMail(newAccount.email, newAccount.full_name, otp.otp, OTPType.VERIFY_ACCOUNT)
      const message = 'Sign up successfully, please check your email for OTP to verify account';
      return res.status(HttpStatus.CREATED).json({ message });
    }
  }

  // * SIGN IN ACCOUNT
  @Post('signin')
  async signin(@Body() body: SigninDto) {
    const account = await this.accountService.checkPassword_Email(body.email, body.password);
    if (!account) {
      throw new BadRequestException('Password is incorrect or email does not exist');
    } else {
      if (!account.verified) {
        const otp = await this.accountService.createOtp(account.id, OTPType.VERIFY_ACCOUNT);
        this.sendOTPMail(account.email, account.full_name, otp.otp, OTPType.VERIFY_ACCOUNT)
        throw new ForbiddenException('The account hasn\'t been verified, please check your email for OTP to verify account');
      }
    }
    const token = await this.accountService.updateRefreshToken(account.id, account.toObject().role);
    return token;
  }

  
  // * OTP verify
  @Post('verify/otp')
  async verifyOTP(@Body() body: OtpVerifyDto, @Res() res: Response) {
    const account = await this.accountService.findOneEmail(body.email);
    if (!account) {
      throw new BadRequestException('Account does not exist');
    } else {
      if (account.verified) {
        throw new BadRequestException('Account has been verified');
      } else {
        const otp = await this.accountService.verifyOtp(account.id, body.otp, OTPType.VERIFY_ACCOUNT);
        if (otp === OTPVerifyStatus.SUCCESS) {
          this.accountService.updateVerifyAccount(account.id);
          const message = 'Account verified successfully, please continue your sign in process' ;          
          return res.status(HttpStatus.OK).json({ message });
        } else {
          throw new BadRequestException('OTP is incorrect or expired');
        }
      }
    }
  }

  // * Refresh token
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refreshToken(@Req() req: RequestWithUser, @Res() res: Response) {
    const token = await this.accountService.check_updateRefreshToken(req.user.sub, req.user.role_id, req.user.refreshToken);
    if (!token) {
      throw new UnauthorizedException('Refresh token is incorrect, please login again');
    } 
    return res.status(HttpStatus.CREATED).json(token);
  }


  // * Get Profile
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'type', enum: RoleType })
  @Get('profile/:type')
  async getProfile(@Req() req: RequestWithUser, @Param() param) {
    const type = param.type;
    const account = await this.accountService.findOneId(req.user.sub);
    let profile = {};
    let result = {
      data: {},
      message: 'OK',
    };
    if (Object.values(RoleType).includes(type as RoleType)){
      if (account.role[type]){
        switch (type) {
          case RoleType.CUSTOMER:
            profile = await this.customerService.findOneId(account.role.customer);
            result.data = {account_id: account.id, full_name: account.full_name, email: account.email, phone: account.phone, profile };
            return result;
          case RoleType.DRIVER:
            profile = await this.driverService.findOneId(account.role.driver);
            result.data = {account_id: account.id, full_name: account.full_name, email: account.email, phone: account.phone, profile };
            return result;          
          case RoleType.RESTAURANT:
            profile =  await this.restaurantService.findOneId(account.role.restaurant);
            result.data = {account_id: account.id, full_name: account.full_name, email: account.email, phone: account.phone, profile };
            return result;
        }
      } else {
        result.data = {account_id: account.id, full_name: account.full_name, email: account.email, phone: account.phone, profile };
        result.message = 'NOT_FOUND';
        return result;
      }
      
    } else {
      throw new NotFoundException('Role type is not valid');
    }
  }

  // * Create new profile ROLE 
  @UseGuards(AuthGuard('jwt'))
  @Post('role/customer')
  async createCustomer(@Body() body: createCustomerDto, @Req() req: RequestWithUser, @Res() res: Response) {
    const account = await this.accountService.findOneId_role(req.user.sub);
    if (account.role.customer){
      throw new BadRequestException('You have already registered as customer');
    } else {
      const newCustomer = await this.customerService.create(body);
      if (!newCustomer) {
        throw new InternalServerErrorException('Something went wrong');
      }
      const updateAccount = await this.accountService.updateRole(req.user.sub, RoleType.CUSTOMER, newCustomer.id);
      if (!updateAccount) {
        throw new InternalServerErrorException('Something went wrong');
      } 
      return res.status(HttpStatus.CREATED).json({ message: 'Create new customer successfully' });
    }
  }  

  @UseGuards(AuthGuard('jwt'))
  @Post('role/driver')
  async createDriver(@Body() body: CreateDriverDto, @Req() req: RequestWithUser, @Res() res: Response) {
    const account = await this.accountService.findOneId_role(req.user.sub);
    if (account.role.driver){
      throw new BadRequestException('You have already registered as driver');
    } else {
      const newDriver = await this.driverService.create(body);
      if (!newDriver) {
        throw new InternalServerErrorException('Something went wrong');
      }
      const updateAccount = await this.accountService.updateRole(req.user.sub, RoleType.DRIVER, newDriver.id);
      if (!updateAccount) {
        throw new InternalServerErrorException('Something went wrong');
      } 
      return res.status(HttpStatus.CREATED).json({ message: 'Create new driver successfully' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('role/restaurant')
  async createRestaurant(@Body() body: CreateRestaurantDto, @Req() req: RequestWithUser, @Res() res: Response) {
    const account = await this.accountService.findOneId_role(req.user.sub);
    if (account.role.restaurant){
      throw new BadRequestException('You have already registered as restaurant');
    } else {
      const newRestaurant = await this.restaurantService.create(body);
      if (!newRestaurant) {
        throw new InternalServerErrorException('Something went wrong');
      }
      const updateAccount = await this.accountService.updateRole(req.user.sub, RoleType.RESTAURANT, newRestaurant.id);
      if (!updateAccount) {
        throw new InternalServerErrorException('Something went wrong');
      } 
      return res.status(HttpStatus.CREATED).json({ message: 'Create new restaurant successfully' });
    }
  }

}
