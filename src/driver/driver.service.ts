import { Injectable, Logger } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Driver, DriverDocument } from './entities/driver.schema';
import { Model } from 'mongoose';
import { LocationObject } from 'src/utils/subschemas/location.schema';
import { DriverStatus, VehicleType } from 'src/utils/enums';
import { AccountServiceAbstract } from 'src/auth/account.abstract.service';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { TransportOrder } from 'src/order/entities/transport_order.schema';

@Injectable()
export class DriverService extends AccountServiceAbstract<Driver>{
  constructor(
      @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
    ) {
      super(driverModel);
    }
  
  logger = new Logger('DriverService');
 
  //TODO add filter to allocate driver
  async findDriverInDistance(dto : AssignDriverDto): Promise<DriverDocument> {

    const coor = dto.order instanceof TransportOrder ? dto.order.pickup_location.coordinates : dto.order.delivery_location.coordinates;
    return await this.driverModel.findOne({
      status: { $eq: DriverStatus.ONLINE },
      vehicle_type: { $eq: dto.vehicle_type },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coor
          },
          $maxDistance: dto.distance
        }
      }
    });
  }

  // async findOneId(id: string): Promise<DriverDocument> {
  //   return this.driverModel.findById(id).exec();
  // }

  // async findAll(): Promise<DriverDocument[]> {
  //   return this.driverModel.find().exec();
  // }

  // async update(id: string, updateDriverDto: UpdateDriverDto): Promise<DriverDocument> {
  //   return this.driverModel.findByIdAndUpdate(id, updateDriverDto, {new: true}).exec();
  // }

  // async remove(id: string) {
  //   return this.driverModel.findByIdAndDelete(id).exec();
  // }
}
