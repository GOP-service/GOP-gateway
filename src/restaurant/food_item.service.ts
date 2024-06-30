import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { FoodItem, FoodItemDocument } from "./entities/food_item.schema";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateFoodItemDto } from "./dto/create-food-item.dto";
import { ModifierGroupService } from "./modifier_groups.service";
import { FoodItemDto } from "./dto/food-item.dto";
import { ModifierGroup } from "./entities/modifier_groups.schema";
import { UpdateFoodItemDto } from "./dto/update-food-item.dto";
import { ModifierGroupsDto } from "./dto/modifier-groups.dto";
import { ModifierDto } from "./dto/modifier.dto";
import { log } from "console";

@Injectable()
export class FoodItemService extends BaseServiceAbstract<FoodItem> {
    constructor(
        @InjectModel(FoodItem.name) private readonly foodItemModel: Model<FoodItem>,
        private readonly modiferGroupService: ModifierGroupService
    ){
        super(foodItemModel);
    }

    async createFoodItem(dto: CreateFoodItemDto) {
        const mg = await this.modiferGroupService.createModifieriGroupList(dto.modifier_groups as ModifierGroup[])
        dto.modifier_groups = mg 
        return await this.create(dto);
    }

    async updateFoodItem(foodItemDto: UpdateFoodItemDto) {
        const foodItem = await this.foodItemModel.findById(foodItemDto._id);
        if(!foodItem){
            throw new NotFoundException('Fooditem not found')
        }
        else {
            foodItem.name = foodItemDto.name;
            foodItem.bio = foodItemDto.bio;
            foodItem.price = foodItemDto.price;
            const currentModifierGroupIds = (foodItem.modifier_groups as string[]).map(groupId =>  groupId.toString())
            const updatedModifierGroupIds = (foodItemDto.modifier_groups as ModifierGroupsDto[]).map(group => group._id);
            const modifierGroupsToDelete = currentModifierGroupIds.filter(id => !updatedModifierGroupIds.includes(id));
            
            this.modiferGroupService.deleteModifierGroups(modifierGroupsToDelete)

            const newMdGroups = await this.modiferGroupService.updateModifierGroups(foodItemDto.modifier_groups as ModifierGroupsDto[])

            foodItem.modifier_groups = newMdGroups;

            await foodItem.save();
            
            return foodItem;
        } 
    }

    async updateFoodItemImg(id: string, imgUrl: string) {
        const img = await this.update(id, {
            image: imgUrl
        })
    }

    async deleteFoodItem(id: string) {
        const now = new Date(); 
        now.setTime(now.getTime() + (7 * 60 * 60 * 1000)); 
        const fooditem = await this.update(id, {
            deleted_at: now
        })
        return fooditem;
    }

    async getFoodItemPrice(id: string): Promise<number> {
        const foodItem = await this.findOneById(id);
        return foodItem.price
    }

    async getFoodItemDetails(id: string) {
        const food = await this.foodItemModel
          .findById(id)
          .populate({ 
              path: 'modifier_groups',
              populate: {
                path: 'modifier',
                model: 'Modifier'
              } 
           })
          .exec();
      
        return food ? food.toJSON() : null;
      }
}