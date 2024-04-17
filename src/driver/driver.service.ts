import { Injectable, Logger } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Driver, DriverDocument } from './entities/driver.schema';
import { Model } from 'mongoose';
import { LocationObject } from 'src/utils/subschemas/location.schema';
import { DriverStatus, VehicleType } from 'src/utils/enums';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TransportOrderDocument } from 'src/order/entities/transport_order.schema';

@Injectable()
export class DriverService {
  constructor(
      @InjectModel(Driver.name) private readonly driverModel: Model<DriverDocument>,
      private eventEmitter: EventEmitter2

    ) {}

  logger = new Logger('DriverService');

  async create(createDriverDto: CreateDriverDto): Promise<DriverDocument> {
    const createdDriver = new this.driverModel(createDriverDto);
    return createdDriver.save();
  }

  async updateLocation(id: string, location: LocationObject): Promise<DriverDocument> {
    return this.driverModel.findByIdAndUpdate
    (id, {location: location}, {new: true}).exec();
  }

  async updateStatus(id: string, status: DriverStatus): Promise<DriverDocument> {
    return this.driverModel.findByIdAndUpdate
    (id, {status: status}, {new: true}).exec();
  }

  
  //TODO add filter to allocate driver
  async findDriverInDistance(point: LocationObject, distance: number, vehicle_type: VehicleType): Promise<DriverDocument> {
    return await this.driverModel.findOne({
      status: { $eq: DriverStatus.ONLINE },
      vehicle_type: { $eq: vehicle_type },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: point.coordinates
          },
          $maxDistance: distance
        }
      }
    });
  }

  async findOneId(id: string): Promise<DriverDocument> {
    return this.driverModel.findById(id).exec();
  }

  async findAll(): Promise<DriverDocument[]> {
    return this.driverModel.find().exec();
  }

  async update(id: string, updateDriverDto: UpdateDriverDto): Promise<DriverDocument> {
    return this.driverModel.findByIdAndUpdate(id, updateDriverDto, {new: true}).exec();
  }

  async remove(id: string) {
    return this.driverModel.findByIdAndDelete(id).exec();
  }
}
