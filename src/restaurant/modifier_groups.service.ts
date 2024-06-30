import { Injectable, NotFoundException } from "@nestjs/common";
import { ModifierGroup, ModifierGroupDocument } from "./entities/modifier_groups.schema";
import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ModifierGroupsDto } from "./dto/modifier-groups.dto";
import { ModifierService } from "./modifier.service";
import { Modifier } from "./entities/modifier.schema";
import { ModifierDto } from "./dto/modifier.dto";

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

    async updateModifierGroups(modifier_groups: ModifierGroupsDto[]): Promise<string[]> {
        let groupIds = [];
        for (const group of modifier_groups) {
            groupIds.push(await this.updateModifierGroup(group));
        }
        return groupIds;
    }

    async updateModifierGroup(modifier_group: ModifierGroupsDto): Promise<string> {
        const mdGroup = modifier_group._id ? await this.modifieGroupModel.findById(modifier_group._id) : new this.modifieGroupModel();
        mdGroup.name = modifier_group.name;
        mdGroup.min = modifier_group.min;
        mdGroup.max = modifier_group.max;

        const currentModifierIds = (mdGroup.modifier as string[]).map(id => id.toString());
        const updatedModifierIds = (modifier_group.modifier as ModifierDto[]).map(modifier => modifier._id || null)
        const modifierToDelete = currentModifierIds.filter(id => !updatedModifierIds.includes(id))

        this.modfierService.deleteModifiers(modifierToDelete);

        const newModifiers = await this.modfierService.updateModifiers(modifier_group.modifier as ModifierDto[])

        mdGroup.modifier = newModifiers;

        await mdGroup.save();
        return mdGroup._id;
    }

    deleteModifierGroups(Ids: string[]): void{
        for (const id of Ids) {
            this.deleteModifierGroup(id);
        }
    }

    async deleteModifierGroup(id: string) {
        const mdGroup = await this.findOneById(id);
        if(!mdGroup){
            throw new NotFoundException('Modifier group not found')
        }
        const now = new Date(); 
        now.setTime(now.getTime() + (7 * 60 * 60 * 1000)); 
        await this.update(id, {
            deleted_at: now
        })
        this.modfierService.deleteModifiers(mdGroup.modifier as string[])
    }

    async getModifierGrps(id: string[]){
        const modifier_groups =  await Promise.all(
            id.map(async item_id => {
                const modifierGr = await this.findOneById(item_id)
                const modifier = await this.modfierService.getModifiers(modifierGr.modifier as string[])
                return { ...(modifierGr as ModifierGroupDocument).toJSON(), modifier }
            })
        )
        return modifier_groups;
    }
}