import { FindAllResponse } from "src/utils/interfaces";
import { Account } from "./entities/account.schema";
import { FilterQuery, Model, QueryOptions } from "mongoose";
import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { CreateAccountDto } from "./dto";
import * as argon2 from 'argon2'
import { JwtService } from "@nestjs/jwt";
import { RoleType } from "src/utils/enums";
import { ConfigService } from "@nestjs/config";

export abstract class AccountServiceAbstract <T extends Account> extends BaseServiceAbstract<T>{
  protected constructor(
      model: Model<T>
  ) {
      super(model);
  }

  
  public get name() : string {
    return this.constructor.name;
  }
  

  async signUp<T extends CreateAccountDto>(dto: T) {
      let account = await this.findOneByCondition({email: dto.email});
      if (account) {
          return null;
      }
      dto.password = await argon2.hash(dto.password);

      return this.create(dto);
  }

  async signIn(email: string, password: string): Promise<{code : string, data: Account}>{
    let msg = {
      code: '0',
      data: null
    } // success
    msg.data = await this.findOneByCondition({email: email});
    if (!msg.data) {
      msg.code = '2'; // wrong email or password
      return msg;
    }
    if (!await argon2.verify(msg.data.password, password)) {
      msg.code = '2'; // wrong email or password
      return msg;
    }
    if (!msg.data.verified) {
      msg.code = '1'; // account not verified
      return msg;
    }
    return msg;
  }

  async updateToken(id: string, token: string) {
    await this.update(id, { refresh_token: token } as Partial<T>);
  }

  async updateVerified(id: string) {
    await this.update(id, {verified: true} as Partial<T>);
  }

  async resetPassword(id: string, password: string) {
    const hash = await argon2.hash(password);
    await this.update(id, {password: hash}as Partial<T>);
  }


    

}