import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './entities/account.schema';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-acc.dto';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from './entities/role.schema';
import { RoleType } from 'src/utils/enums';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(dto: CreateAccountDto): Promise<AccountDocument> {
    dto.password = await argon2.hash(dto.password);
    const createdAccount = new this.accountModel(dto);
    return createdAccount.save();
  }

  async getTokens(userId: string,role: RoleType) {
    const [ accessToken, refreshToken ] = await Promise.all([
        this.jwtService.signAsync(
            {
                sub: userId,
                role: role
            },
            {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: '15m'
            }
        ),
        this.jwtService.signAsync(
            {
                sub: userId,
                role: role
            },
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '70d'
            }
        )
    ])

    return {
        accessToken,
        refreshToken
    }
}

  async checkPassword_Phone(phone: string, password: string): Promise<AccountDocument> {
    const account = await this.accountModel.findOne({ phone:phone }).exec();
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

  async findOnePhone(phone: string,role: RoleType): Promise<AccountDocument> {
    const account = await this.accountModel.findOne({ phone:phone }).exec();
    switch (role) {
      case RoleType.CUSTOMER:
        if (account.role.customer && account.role.customer !== '') {
          return account;
        } else {
          return null;
        }
      case RoleType.DRIVER:
        if (account.role.driver && account.role.driver !== '') {
          return account;
        } else {
          return null;
        }
      case RoleType.RESTAURANT:
        if (account.role.restaurant && account.role.restaurant !== '') {
          return account;
        } else {
          return null;
        }
      case RoleType.ADMIN:
        if (account.role.admin) {
          return account;
        } else {
          return null;
        }
      default:
        return null;
    }

  }

  async updateRefreshToken(phone: string, refreshToken: string): Promise<AccountDocument> {
    return await this.accountModel.findOneAndUpdate({ phone:phone }, { refreshToken: refreshToken }).exec();
  }
}
