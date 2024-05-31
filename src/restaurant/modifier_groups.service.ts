import { Injectable } from "@nestjs/common";
import { ModifierGroup, ModifierGroupDocument } from "./entities/modifier_groups.schema";
import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ModifierGroupsDto } from "./dto/modifier-groups.dto";
import { ModifierService } from "./modifier.service";
import { Modifier } from "./entities/modifier.schema";

@Injectable()
export class ModifierGroupService extends BaseServiceAbstract<ModifierGroup>{
    constructor(
        @InjectModel(ModifierGroup.name) private readonly modifieGroupModel: Model<ModifierGroup>,
        private readonly modfierService: ModifierService
    ){
        super(modifieGroupModel);
    }    

    async createModifieriGroup(dto: ModifierGroupsDto){
        const md = await this.modfierService.createListModifier(dto.modifier as Modifier[]) 
        dto.modifier = md

        const mg = await this.create(dto)
        return mg;
    }

    async createModifieriGroupList(dto: ModifierGroup[]): Promise<string[]>{
        return await Promise.all(dto.map(async (item) => {
            return (await this.createModifieriGroup(item))._id
        }))
    }

    async getModifierGrps(id: string[]){
        const modifier_groups =  await Promise.all(
            id.map(async item_id => {
                const modifierGr = await this.findOneById(item_id)
                const modifier = await this.modfierService.getModifiers(modifierGr.modifier as string[])
                return { ...(modifierGr as ModifierGroupDocument).toObject(), modifier }
            })
        )
        return modifier_groups;
    }
}