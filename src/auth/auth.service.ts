import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OTPType, OTPVerifyStatus, RoleType } from 'src/utils/enums';

import { Otp, OtpDocument } from './entities/otp.schema';
import { OtpTemplate } from 'src/utils/mail-template/otp';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationTemplate } from 'src/utils/mail-template/noti';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService,

  ) {}

  
  async sendOTPMail(mail: string, usename: string,user_id: string, type: OTPType) {
    let otp = await this.createOtp(user_id, type);
    return await this.mailerService.sendMail({
      to: mail,
      subject: 'OTP verification',
      text: 'OTP verification',
      html: OtpTemplate(usename,otp.otp,type),
    });
  }

  async sendNotification(mail: string, usename: string,) {
    return await this.mailerService.sendMail({
      to: mail,
      subject: 'OTP verification',
      text: 'OTP verification',
      html: NotificationTemplate(usename),
    });
  }

  async createOtp(user_id: string, type: OTPType): Promise<OtpDocument> {
    const random = Math.log(Math.round(Math.random()*Date.now()))

    const newOtp = new this.otpModel({
      owner_id: user_id,
      type: type,
      otp: random.toString().slice(-6),
    })
    return await newOtp.save();
  }

  async verifyOtp(user_id: string, otp: string, type: OTPType): Promise<OTPVerifyStatus> {
    const otpCheck = await this.otpModel.findOne({ owner_id: user_id, otp: otp, type: type }).exec();
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
  
  removeOtp() {
    this.otpModel.deleteMany({ expired_at: { $lt: Date.now() } }).exec();
  }

  async getTokens(userId: string,role: string) {
    const [ accessToken, refreshToken ] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          role: role
        },
        {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '15y' // !!!! nhớ đổi lại
        }),
      this.jwtService.signAsync(
        {
          sub: userId,
          role: role
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

  // async check_updateRefreshToken(account: Account, refreshToken: string, role: RoleType) {
  //   if (!account) {
  //     return null;
  //   } else {
  //     if (account.refreshToken === refreshToken) {
  //       const token = await this.getTokens(account._id, role);
  //       account.refreshToken = token.refreshToken;
  //       return token;
  //     } else {
  //       account.refreshToken = null;
  //       return false;
  //     }
  //   }
  // }

  // async updateRole(id: string, role_type: RoleType, role_id: string) {
  //   const account = await this.accountModel.findById(id).exec();
  //   if (!account) {
  //     return null;
  //   }

  //   if (this.getRoles(account.role).includes(role_type)) {
  //     return null;
  //   }

  //   account.role[role_type.toString()] = role_id;

  //   await account.save();

  //   return await this.updateRefreshToken(account._id,account.toObject().role)
  // }
  
  // async updateRefreshToken(user: string,role: RoleType) {
  //   const cus = await this.accountModel.findById(user).exec();
  //   cus.refreshToken = 'ododoodod';
  //   return await cus.save();
  // }

}
