import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RoleType } from 'src/utils/enums';
import { AccountService } from 'src/auth/account.service';
import { RequestWithUser } from 'src/utils/interfaces';
import { CreateRestaurantCategoryDto } from './dto/create-restaurant-category.dto';
import { UpdateItemsRestaurantDto } from './dto/update-item-restaurant-category.dto';


@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'),RolesGuard)
@ApiTags('Restaurants')
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    ) {}
    
  @Roles(RoleType.RESTAURANT)
  @Get('info')
  info(@Req() req: RequestWithUser) {
    return this.restaurantService.findOneId(req.user.role_id.restaurant);
  }
  
  @Roles(RoleType.RESTAURANT)
  @ApiQuery({
    name: 'index', 
    type: Number,
    example: 0,
  })
  @Patch('categories/update')
  updateCategories(@Req() req: RequestWithUser, @Body() body: UpdateItemsRestaurantDto, @Query() query: {index: number}) {
    if (query.index === undefined || query.index === null || query.index < 0) {
      throw new BadRequestException('index is required and must be a positive number');
    }
    return this.restaurantService.updateCategories(req.user.role_id.restaurant, body, query.index);
  }

  @Roles(RoleType.RESTAURANT)
  @Post('categories/add')
  addCategory(@Req() req: RequestWithUser, @Body() body: CreateRestaurantCategoryDto) {
    try {
      // return this.restaurantService.addCategory(req.user.role_id.restaurant, body);
    } catch (error) {
      return error;
    }
  }

}
