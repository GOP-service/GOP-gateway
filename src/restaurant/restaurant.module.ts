import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { Restaurant, RestaurantSchema } from './entities/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantCategory, RestaurantCategorySchema } from './entities/restaurant_category.schema';
import { FoodItem, FoodItemSchema } from './entities/food_item.schema';
import { ModifierGroup, ModifierGroupSchema } from './entities/modifier_groups.schema';
import { Modifier, ModifierSchema } from './entities/modifier.schema';
import { Order, OrderSchema } from 'src/order/entities/order.schema';
import { OrderModule } from 'src/order/order.module';
import { Otp, OtpSchema } from 'src/auth/entities/otp.schema';
import { AzureStorageModule } from 'src/utils/auzre/storage-blob.module';
import { ModifierService } from './modifier.service';
import { ModifierGroupService } from './modifier_groups.service';
import { RestaurantCategoryService } from './restaurant_category.service';
import { FoodItemService } from './food_item.service';
import { VietMapModule } from 'src/utils/map-api/viet-map.module';
import { PaymentModule } from 'src/payment/payment.module';
import { FirebaseModule } from 'src/utils/firebase/firebase.module';
import { Review, ReviewSchema } from './entities/review.schema';
import { CuisineCategories, CuisineCategoriesSchema } from './entities/cuisine_categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema, },
      { name: Review.name, schema: ReviewSchema, },
      { name: CuisineCategories.name, schema: CuisineCategoriesSchema, },
      { name: RestaurantCategory.name, schema: RestaurantCategorySchema, },
      { name : FoodItem.name, schema: FoodItemSchema,},
      { name : ModifierGroup.name, schema: ModifierGroupSchema,},
      { name : Modifier.name, schema: ModifierSchema,},
    ]),
    AzureStorageModule,
    VietMapModule,
    PaymentModule,
    FirebaseModule
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantCategoryService, FoodItemService, ModifierGroupService, ModifierService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
