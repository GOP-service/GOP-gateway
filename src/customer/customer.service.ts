import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './entities/customer.schema';
import { Model } from 'mongoose';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerDocument> {
    const createdCustomer = new this.customerModel(dto);
    return createdCustomer.save();
  }

  async findOneId(id: string): Promise<CustomerDocument> {
    return this.customerModel.findById(id);
  }

  async findAll(): Promise<CustomerDocument[]> {
    return this.customerModel.find();
  }
  
}
