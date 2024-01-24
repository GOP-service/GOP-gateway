import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RoleType } from 'src/utils/enums';
import { AccountService } from 'src/auth/account.service';
import { RequestWithUser } from 'src/utils/interfaces';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';


@ApiBearerAuth()
@Roles(RoleType.RESTAURANT)
@UseGuards(AuthGuard('jwt'),RolesGuard)
@ApiTags('Restaurants')
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
  ) {}
  
  @Get('info')
  info(@Req() req: RequestWithUser) {
    return this.restaurantService.findOneId(req.user.role_id.restaurant);
  }

  @Patch('categories')
  updateCategories(@Req() req: RequestWithUser, @Body() body: CreateRestaurantCategoryDto) {
    return this.restaurantService.updateCategories(req.user.role_id.restaurant, body);
  }

}
