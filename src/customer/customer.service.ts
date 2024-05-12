import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountServiceAbstract } from 'src/auth/account.abstract.service';

@Injectable()
export class  CustomerService extends AccountServiceAbstract<Customer> {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
  ) {
    super(customerModel);
  }

  async getProfile(id: string) {
    
  }
  
  
  
}
