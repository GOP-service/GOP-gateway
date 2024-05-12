import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, InternalServerErrorException, BadRequestException, Req, UseGuards, Logger, UnauthorizedException, Res, HttpCode, HttpStatus, ForbiddenException, NotFoundException } from '@nestjs/common';
import e, { Response } from 'express';
import { AuthService } from './auth.service';
import { CustomerService } from 'src/customer/customer.service';
import { DriverService } from 'src/driver/driver.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { OTPType, OTPVerifyStatus, RoleType } from 'src/utils/enums';
import { CreateAccountDto, OtpVerifyDto, SigninDto, } from './dto';
import { RequestWithUser } from 'src/utils/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpTemplate } from 'src/utils/mail-template/otp';
import { CreateDriverDto } from 'src/driver/dto/create-driver.dto';
import { CreateRestaurantDto } from 'src/restaurant/dto/create-restaurant.dto';
import { createCustomerDto } from 'src/customer/dto/create-customer.dto';
import { log, profile } from 'console';
import { PaymentService } from 'src/payment/payment.service';
import { AccountServiceAbstract } from './account.abstract.service';
import { Customer } from 'src/customer/entities/customer.schema';
import { Account } from './entities/account.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@ApiBearerAuth()
@ApiTags('Authentications')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly accountService: AuthService,
    private readonly customerService: CustomerService,
    private readonly driverService: DriverService,
    private readonly restaurantService: RestaurantService,
    private readonly paymentService: PaymentService,

  ) {}

  logger = new Logger('AuthController');  

  // * SIGN UP ACCOUNT 
  private sign_up(body: CreateAccountDto, res: Response, service: AccountServiceAbstract<Account>){
    service.signUp(body).then(async (account) => {
      if (!account) {
        return res.status(HttpStatus.CONFLICT).json({message: 'Email is already in use'});
      }
      this.accountService.sendOTPMail(account.email, account.full_name, account._id, OTPType.VERIFY_ACCOUNT);
      return res.status(HttpStatus.CREATED).json({message: 'OK'});
    }).catch((err) => {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: err.message});
    });
  }

  @Post('customer/signup')
  async signupCustomer(@Body() body: createCustomerDto , @Res() res: Response) {
    this.sign_up(body, res, this.customerService);
  }

  @Post('driver/signup')
  async signupDriver(@Body() body: CreateDriverDto , @Res() res: Response) {
    this.sign_up(body, res, this.driverService);
  }

  // * SIGN IN ACCOUNT
  private sign_in(body: SigninDto, res: Response, service: AccountServiceAbstract<Account>){
    service.signIn(body.email, body.password).then(async (msg) => {
      if (msg.code === '1') {
        this.accountService.sendOTPMail(msg.data.email, msg.data.full_name, msg.data._id, OTPType.VERIFY_ACCOUNT);
        return res.status(HttpStatus.FORBIDDEN).json({message: 'Email has not been verified'});
      } else if (msg.code === '2') {
        return res.status(HttpStatus.FORBIDDEN).json({message: 'Email or Password is incorrect'});
      }
      const token = await this.accountService.getTokens(msg.data._id,service.name);
      service.updateToken(msg.data._id, token.refreshToken);
      return res.status(HttpStatus.OK).json(token);
    }).catch((err) => {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: err.message});
    });
  }

  @Post('customer/signin')
  async signinCustomer(@Body() body: SigninDto, @Res() res: Response) {
    this.sign_in(body, res, this.customerService);
  }

  @Post('driver/signin')
  async signinDriver(@Body() body: SigninDto, @Res() res: Response) {
    this.sign_in(body, res, this.driverService);
  }

  // todo 
  // @Post('restaurant/signin')
  // async signinRestaurant(@Body() body: SigninDto, @Res() res: Response) {
  //   this.sign_in(body, res, this.restaurantService);
  // }

  
  // * OTP verify
  private async verifyOTP(body: OtpVerifyDto, res: Response, service: AccountServiceAbstract<Account>){
    service.findOneByCondition({email: body.email}).then(async (account) => {
      if (!account) {
        return res.status(HttpStatus.NOT_FOUND).json({message: 'Email is not found'});
      } else if (account.verified) {
        return res.status(HttpStatus.BAD_REQUEST).json({message: 'Account is already verified'});
      }
      const otp_result = await this.accountService.verifyOtp(account._id, body.otp, OTPType.VERIFY_ACCOUNT);
      if (otp_result === OTPVerifyStatus.SUCCESS) {
        await service.updateVerified(account._id);
        return res.status(HttpStatus.OK).json({message: otp_result});
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({message: otp_result});
      }
    }).catch((err) => {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: err.message});
    });
  }

  @Post('customer/verify/otp')
  async verifyOTP_customer(@Body() body: OtpVerifyDto, @Res() res: Response) {
    this.verifyOTP(body, res, this.customerService);
  }

  @Post('driver/verify/otp')
  async verifyOTP_driver(@Body() body: OtpVerifyDto, @Res() res: Response) {
    this.verifyOTP(body, res, this.driverService);
  }
  

  // * Refresh token
  private async refreshToken(req: RequestWithUser, res: Response, service: AccountServiceAbstract<Account>){
    const token = await service.findOneByCondition({_id: req.user.sub, refresh_token: req.user.refreshToken});
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Refresh token is incorrect, please login again'});
    }
    const new_token = await this.accountService.getTokens(req.user.sub, service.name);
    service.updateToken(req.user.sub, new_token.refreshToken);
    return res.status(HttpStatus.CREATED).json(new_token);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('customer/refresh')
  async refreshToken_customer(@Req() req: RequestWithUser, @Res() res: Response) {
    this.refreshToken(req, res, this.customerService);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('driver/refresh')
  async refreshToken_driver(@Req() req: RequestWithUser, @Res() res: Response) {
    this.refreshToken(req, res, this.driverService);
  }

  // todo
  // * Forgot password
  private async forgotPasswordRequest(email: string, res: Response, service: AccountServiceAbstract<Account>){
    service.findOneByCondition({email: email}).then(async (account) => {
      if (!account) {
        return res.status(HttpStatus.NOT_FOUND).json({message: 'Email is not found'});
      }
      this.accountService.sendOTPMail(account.email, account.full_name, account._id, OTPType.FORGOT_PASSWORD);
      return res.status(HttpStatus.OK).json({message: 'Please check your email to reset password'});
    }).catch((err) => {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: err.message});
    });
  }

  private async forgotPasswordValidate(body: OtpVerifyDto, res: Response, service: AccountServiceAbstract<Account>){
    
  }



 
}
