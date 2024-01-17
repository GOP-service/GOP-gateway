import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { Restaurant, RestaurantSchema } from './entities/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantCategory, RestaurantCategorySchema } from './entities/restaurant_category.schema';
import { RestaurantFoodReview, RestaurantFoodReviewSchema } from './entities/restaurant_food_review.schema';
import { RestaurantProfile, RestaurantProfileSchema } from './entities/restaurant_profile.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema, },
      { name: RestaurantCategory.name, schema: RestaurantCategorySchema, },
      { name: RestaurantFoodReview.name, schema: RestaurantFoodReviewSchema, },
    ]),
    
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
