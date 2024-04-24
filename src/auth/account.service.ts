import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './entities/account.schema';
import { Model } from 'mongoose';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OTPType, OTPVerifyStatus, RoleType } from 'src/utils/enums';
import { CreateAccountDto } from './dto';
import { Role } from './entities/role.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpTemplate } from 'src/utils/mail-template/otp';
import { Otp, OtpDocument } from './entities/otp.schema';
import e from 'express';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}



  getRoles(roles: Role) {
    return Object.keys(roles).filter(
      (key) => roles[key] !== undefined 
            && roles[key] !== null
            && roles[key] !== false
            && roles[key] !== '');
  }

  async createAccount(dto: CreateAccountDto): Promise<AccountDocument> {
    dto.password = await argon2.hash(dto.password);

    const createdAccount = new this.accountModel(dto);

    return createdAccount.save();
  }

  async createOtp(user_id: string, type: OTPType): Promise<OtpDocument> {
    const newOtp = new this.otpModel({
      owner_id: user_id,
      type: type,
    })
    return await newOtp.save();
  }

  async verifyOtp(user_id: string, otp: string, type: OTPType): Promise<OTPVerifyStatus> {
    const otpCheck = await this.otpModel.findOne({ user_id: user_id, otp: otp, type: type }).exec();
    if (!otpCheck) {
      return OTPVerifyStatus.OTP_WRONG;
    } else {
      if (otpCheck.expired_at < Date.now()) {
        return OTPVerifyStatus.OTP_EXPIRED;
      } else {
        this.otpModel.findByIdAndDelete(otpCheck._id).exec();
        return OTPVerifyStatus.SUCCESS;
      }
    }
  }

  async updateVerifyAccount(user_id: string): Promise<void> {
    await this.accountModel.findByIdAndUpdate(user_id, { verified: true }).exec();
  }
  
  removeOtp() {
    this.otpModel.deleteMany({ expired_at: { $lt: Date.now() } }).exec();
  }

  async getTokens(userId: string,role: Role) {
    const [ accessToken, refreshToken ] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          role_id: role
        },
        {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '15y' // !!!! nhớ đổi lại
        }),
      this.jwtService.signAsync(
        {
          sub: userId,
          role_id: role
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d'
        })
      ])
    return {
      accessToken,
      refreshToken
    }
}

async checkPassword_Phone(phone: string, password: string): Promise<AccountDocument> {
  const account = await this.accountModel.findOne({ phone:phone }, 'password role').exec();
  if (!account) {
      return null;
    } else {
      const isMatch = await argon2.verify(account.password, password);
      if (isMatch) {
        return account;
      } else {
        return null;
      }
    }
  }

  async checkPassword_Email(email: string, password: string): Promise<AccountDocument> {
    const account = await this.accountModel.findOne({ email:email }, 'id email full_name password role verified').exec();
    if (!account) {
      return null;
    } else {
      const isMatch = await argon2.verify(account.password, password);
      if (isMatch) {
        account.password = '';
        return account;
      } else {
        return null;
      }
    }
  }
  
  async findOnePhone(phone: string): Promise<AccountDocument> {
    const account = await this.accountModel.findOne({ phone:phone }).exec();
    return account;
  }

  async findOneEmail(email: string): Promise<AccountDocument> {
    return await this.accountModel.findOne({ email:email }).exec();
  }

  async findOneId(id: string): Promise<AccountDocument> {
    const account = await this.accountModel.findById(id).exec();
    return account;
  }

  async findOneId_role(id: string): Promise<AccountDocument> {
    const account = await this.accountModel.findById(id,'role').exec();
    return account;
  }

  async check_updateRefreshToken(userId: string, role: Role, refreshToken: string) {
    const account = await this.accountModel.findById(userId).exec();
    if (!account) {
      return null;
    } else {
      if (account.refreshToken === refreshToken) {
        const token = await this.getTokens(userId,role);
        
        account.refreshToken = token.refreshToken;
        account.save();
        return token;
      } else {
        account.refreshToken = null;
        account.save();
        return false;
      }
    }
  }

  async updateRole(id: string, role_type: RoleType, role_id: string) {
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      return null;
    }

    if (this.getRoles(account.role).includes(role_type)) {
      return null;
    }

    account.role[role_type.toString()] = role_id;

    await account.save();

    return await this.updateRefreshToken(account._id,account.toObject().role)
  }
  
  async updateRefreshToken(userId: string,role: Role) {
    const token = await this.getTokens(userId, role);
    if (this.accountModel.findByIdAndUpdate(userId, { refreshToken: token.refreshToken }).exec()){
      return token;
    }
    return null;
  }

}
