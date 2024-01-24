import { Injectable } from '@nestjs/common';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './entities/customer.schema';
import { Model } from 'mongoose';
import { createCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(dto: createCustomerDto): Promise<CustomerDocument> {
    const createdCustomer = new this.customerModel(dto);
    return createdCustomer.save();
  }

  async findOneId(id: string): Promise<CustomerDocument> {
    return this.customerModel.findById(id);
  }

  async findAll(): Promise<CustomerDocument[]> {
    return this.customerModel.find();
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerDocument> {
    return this.customerModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string) {
    await this.customerModel.findByIdAndDelete(id).exec();
  }
  
}
