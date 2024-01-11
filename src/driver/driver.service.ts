import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Driver, DriverDocument } from './entities/driver.schema';
import { Model } from 'mongoose';

@Injectable()
export class DriverService {
  constructor(
      @InjectModel(Driver.name) private readonly driverModel: Model<DriverDocument>,
    ) {}


  async create(createDriverDto: CreateDriverDto): Promise<DriverDocument> {
    const createdDriver = new this.driverModel(createDriverDto);
    return createdDriver.save();
  }

  async findOneId(id: string): Promise<DriverDocument> {
    return this.driverModel.findById(id);
  }
}
