import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { RequestWithUser } from 'src/utils/interfaces';
import { UpdateStatusDriverDto } from './dto/update-status-driver.dto';
import { OrderStatus, VehicleType } from 'src/utils/enums';
import { OrderService } from 'src/order/order.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'),RolesGuard)
@ApiTags('Driver')
@Controller('driver')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Patch('status')
  updateStatus(@Body() dto: UpdateStatusDriverDto, @Req() req: RequestWithUser){
    return this.driverService.updateStatus(req.user.role_id.driver, dto.status);
  }

  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOneId(id);
  }

  @Post('find/coordinates')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lng: { type: 'string' },
        lat: { type: 'string' },
        distance: { type: 'string' }
      }
    }
  })
  findDriverInDistance(@Body() dto: any){
    return this.driverService.findDriverInDistance({type: 'Point', coordinates: [parseFloat(dto.lng), parseFloat(dto.lat)]}, parseFloat(dto.distance), VehicleType.BIKE);
  }

  @Get('order/:id/accept')
  async acceptOrder(@Param('id') id: string, @Req() req: RequestWithUser){
    try {
      const result = await this.orderService.TransportOrderStatusChange_allocated(id,req.user.role_id.driver,OrderStatus.PICKING_UP);
      this.eventEmitter.emit('order.driver.accept', result);
      return result;
    } catch (e) {
      return e;
    }
  }

  @Get('delivery/order/:id/accept')
  async acceptDeliveryOrder(@Param('id') id: string, @Req() req: RequestWithUser){
    try {
      const result = await this.orderService.DeliveryOrderStatusChange(id, OrderStatus.PICKING_UP, req.user.role_id.driver);
      this.eventEmitter.emit('order.driver.accept', result);
      return result;
    } catch (e) {
      return e;
    }
  }

  @Get('delivery/order/:id/reject')
  async rejectDeliveryOrder(@Param('id') id: string, @Req() req: RequestWithUser){
    try {
      const result = await this.orderService.DeliveryOrderStatusChange(id, OrderStatus.FAILED, req.user.role_id.driver);
      this.eventEmitter.emit('order.driver.reject', result);
      return result;
    } catch (e) {
      return e;
    }
  }

  @Get('order/:id/reject')
  async rejectOrder(@Param('id') id: string, @Req() req: RequestWithUser){
    try {
      const result = await this.orderService.TransportOrderStatusChange_allocated(id,req.user.role_id.driver,OrderStatus.FAILED);
      this.eventEmitter.emit('order.driver.reject', result);
      return result;
    } catch (e) {
      return e;
    }
  }

  @Get('order/:id/arrived-restaurant')
  async arrivedRestaurant(@Param('id') id: string, @Req() req: RequestWithUser){
    try {
      const order = await this.orderService.DeliveryOrderStatusChange(id, OrderStatus.PENDING_DROP_OFF, req.user.role_id.driver);
      let otp = await this.orderService.createOTPOrder(order.id)
      this.eventEmitter.emit('order.arrived_restaurant', order);
      return {
        otp: otp.otp,
        order
      };
    } catch (e) {
      return e;
    }
  }

  @Get('order/:id/trip/arrived_pickup')
  async arrivedPickup(@Param('id') id: string, @Req() req: RequestWithUser){
    try {
      const result = await this.orderService.TransportOrderStatusChange_allocated(id,req.user.role_id.driver,OrderStatus.PENDING_DROP_OFF);
      this.eventEmitter.emit('order.trip.arrived_pickup', result);
      return result;
    } catch (e) {
      return e;
    }
  }

  @Get('order/:id/trip/picked_up')
  async pickedUp(@Param('id') id: string, @Req() req: RequestWithUser){
    try {
      const result = await this.orderService.TransportOrderStatusChange_allocated(id,req.user.role_id.driver,OrderStatus.DROPPING_OFF);
      this.eventEmitter.emit('order.trip.picked_up', result);
      return result;
    } catch (e) {
      return e;
    }
  }

  @Get('order/:id/completed')
  async completed(@Param('id') id: string, @Req() req: RequestWithUser){
    try {
      const result = await this.orderService.TransportOrderStatusChange_allocated(id,req.user.role_id.driver,OrderStatus.COMPLETED);
      this.eventEmitter.emit('order.completed', result);
      return result;
    } catch (e) {
      return e;
    }
  }

  @Get('delivery/order/:id/completed')
  async completedDeliveryOrder(@Param('id') id: string, @Req() req: RequestWithUser){
    try {
      const result = await this.orderService.DeliveryOrderStatusChange(id, OrderStatus.COMPLETED, req.user.role_id.driver);
      this.eventEmitter.emit('order.completed', result);
      return result;
    } catch (e) {
      return e;
    }
  }
}
