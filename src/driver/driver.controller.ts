import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, Res, Get } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { IDriverController, RequestWithUser } from 'src/utils/interfaces';
import { UpdateStatusDriverDto } from './dto/update-status-driver.dto';
import { DriverStatus, OrderStatus, PaymentMethod, VehicleType } from 'src/utils/enums';
import { OrderService } from 'src/order/order.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PaymentService } from 'src/payment/payment.service';
import { CreateBillDto } from 'src/payment/dto/create-bill.dto';
import { Response } from 'express';
import { AssignDriverDto } from './dto/assign-driver.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'),RolesGuard)
@ApiTags('Driver')
@Controller('driver')
export class DriverController implements IDriverController{
  constructor(
    private readonly driverService: DriverService,
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
    private readonly paymentService: PaymentService,

  ) {}

  @Get('profile')
  getProfile(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Patch('profile')
  updateProfile(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('order/:id/accept')
  acceptOrder(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('order/:id/reject')
  rejectOrder(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Patch('active/:status')
  updateActiveStatus(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('order/:id/arrived')
  arrivedPickup(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('order/:id/pickedup')
  pickedUp(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('order/:id/restaurant/arrived')
  arrivedRestaurant(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('order/:id/completed')
  completeOrder(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Post('order/:id/cancel')
  cancelOrder(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('revenue')
  getDriverRevenueStats(): Promise<any> {
    throw new Error('Method not implemented.');
  }



  // @Patch('status')
  // updateStatus(@Body() dto: UpdateStatusDriverDto, @Req() req: RequestWithUser){
  //   return this.driverService.updateStatus(req.user.role_id.driver, dto.status);
  // }

  @Get('profile')
  async findAll(@Req() req: RequestWithUser, @Res() res: Response) {
    await this.driverService.findOneById(req.user.sub).then(profile => {
      if (profile) {
        return res.status(200).json({
          _id: profile._id,
          email: profile.email,
          full_name: profile.full_name,
          // phone: profile.phone, //todo add phone
          avatar: profile.avatar,
          vehicle: profile.vehicle_model,
          vehicle_type: profile.vehicle_type,
          vehicle_plate: profile.vehicle_plate_number,
          status: profile.status,
        })
      }
    });
  }

  @Get('startwork')
  async startWork(@Req() req: RequestWithUser){
    return this.driverService.update(req.user.sub, {status: DriverStatus.ONLINE});
  }

  @Get('stopwork')
  async stopWork(@Req() req: RequestWithUser){
    return this.driverService.update(req.user.sub, {status: DriverStatus.OFFLINE});
  }

  @Get('orderhistory')
  async orderHistory(@Req() req: RequestWithUser){
    // return this.orderService.findOrderByDriverId(req.user.sub);
  }

  @OnEvent('Assign.Driver.request')
  async assignDriverRequest(payload: AssignDriverDto){
    return this.driverService.findDriverInDistance(payload);
    
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.driverService.findOneId(id);
  // }

  // @Post('find/coordinates')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       lng: { type: 'string' },
  //       lat: { type: 'string' },
  //       distance: { type: 'string' }
  //     }
  //   }
  // })
  // findDriverInDistance(@Body() dto: any){
  //   return this.driverService.findDriverInDistance({type: 'Point', coordinates: [parseFloat(dto.lng), parseFloat(dto.lat)]}, parseFloat(dto.distance), VehicleType.BIKE);
  // }

  // //* TRANSPORT ORDER

  // //* accept transport order
  // @Get('transport/order/:id/accept')
  // async acceptOrder(@Param('id') id: string, @Req() req: RequestWithUser){
  //   try {
  //     const result = await this.orderService.TransportOrderStatusChange_allocated(id,req.user.role_id.driver,OrderStatus.PICKING_UP);
  //     this.eventEmitter.emit('order.driver.accept', result);
  //     return result;
  //   } catch (e) {
  //     return e;
  //   }
  // }

  // //* reject transport order
  // @Get('transport/order/:id/reject')
  // async rejectOrder(@Param('id') id: string, @Req() req: RequestWithUser){
  //   try {
  //     const result = await this.orderService.TransportOrderStatusChange_allocated(id,req.user.role_id.driver,OrderStatus.FAILED);
  //     this.eventEmitter.emit('order.driver.reject', result);
  //     return result;
  //   } catch (e) {
  //     return e;
  //   }
  // }

  // @Get('transport/order/:id/trip/arrived_pickup')
  // async arrivedPickup(@Param('id') id: string, @Req() req: RequestWithUser){
  //   try {
  //     const result = await this.orderService.TransportOrderStatusChange_allocated(id,req.user.role_id.driver,OrderStatus.PENDING_DROP_OFF);
  //     this.eventEmitter.emit('order.trip.arrived_pickup', result);
  //     return result;
  //   } catch (e) {
  //     return e;
  //   }
  // }

  // @Get('transport/order/:id/trip/picked_up')
  // async pickedUp(@Param('id') id: string, @Req() req: RequestWithUser){
  //   try {
  //     const result = await this.orderService.TransportOrderStatusChange_allocated(id,req.user.role_id.driver,OrderStatus.DROPPING_OFF);
  //     this.eventEmitter.emit('order.trip.picked_up', result);
  //     return result;
  //   } catch (e) {
  //     return e;
  //   }
  // }

  // @Get('transport/order/:id/completed')
  // async completed(@Param('id') id: string, @Req() req: RequestWithUser){
  //   try {
  //     const result = await this.orderService.TransportOrderStatusChange_allocated(id,req.user.role_id.driver,OrderStatus.COMPLETED);
  //     this.paymentService.updateBillPaid(result);
  //     this.eventEmitter.emit('order.completed', result);
  //     return result;
  //   } catch (e) {
  //     return e;
  //   }
  // }

  
  // //* DELIVERY ORDER
  
  // //* accept delivery order
  // @Get('delivery/order/:id/accept')
  // async acceptDeliveryOrder(@Param('id') id: string, @Req() req: RequestWithUser){
  //   try {
  //     const result = await this.orderService.DeliveryOrderStatusChange(id, OrderStatus.PICKING_UP, req.user.role_id.driver);
  //     this.eventEmitter.emit('order.driver.accept', result);
  //     return result;
  //   } catch (e) {
  //     return e;
  //   }
  // }
  
  // //* reject delivery order
  // @Get('delivery/order/:id/reject')
  // async rejectDeliveryOrder(@Param('id') id: string, @Req() req: RequestWithUser){
  //   try {
  //     const result = await this.orderService.DeliveryOrderStatusChange(id, OrderStatus.FAILED, req.user.role_id.driver);
  //     this.eventEmitter.emit('order.driver.reject', result);
  //     return result;
  //   } catch (e) {
  //     return e;
  //   }
  // }
  
  // @Get('delivery/order/:id/arrived-restaurant')
  // async arrivedRestaurant(@Param('id') id: string, @Req() req: RequestWithUser){
  //   try {
  //     const order = await this.orderService.DeliveryOrderStatusChange(id, OrderStatus.PENDING_DROP_OFF, req.user.role_id.driver);
  //     let otp = await this.orderService.createOTPOrder(order.id)
  //     this.eventEmitter.emit('order.arrived_restaurant', order);
  //     return {
  //       otp: otp.otp,
  //       order
  //     };
  //   } catch (e) {
  //     return e;
  //   }
  // }

  // @Get('delivery/order/:id/completed')
  // async completedDeliveryOrder(@Param('id') id: string, @Req() req: RequestWithUser){
  //   try {
  //     const result = await this.orderService.DeliveryOrderStatusChange(id, OrderStatus.COMPLETED, req.user.role_id.driver);
  //     this.eventEmitter.emit('order.completed', result);
  //     return result;
  //   } catch (e) {
  //     return e;
  //   }
  // }
}

