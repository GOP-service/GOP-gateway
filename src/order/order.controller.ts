import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTransportOrderDto } from './dto/create-transport-order';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/utils/interfaces';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RoleType } from 'src/utils/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'),RolesGuard)
@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.orderService.findOrderById(id);
    } catch (error) {
      return error;
    }
  }

  // @Post('Driver/submit')
}
