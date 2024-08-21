import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { Modifier } from "./entities/modifier.schema";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ModifierDto } from "./dto/modifier.dto";

@Injectable()
export class ModifierService extends BaseServiceAbstract<Modifier>{
    constructor(
        @InjectModel(Modifier.name) private readonly modifierModel: Model<Modifier>,

    ){
        super(modifierModel);
    }

    async createListModifier(dto: ModifierDto[]): Promise<string[]> {
        return await Promise.all(dto.map(async (item) => {
            return (await this.create(item))._id
        }))
    }

    async getModifierPrice(id: string): Promise<number> {
        const modifier = await this.findOneById(id);
        return modifier.price
    }

    async getModifiers(id: string[]){
        const modifier = await Promise.all(
            id.map(async md_id => {
                return await this.findOneById(md_id)
            })
        )
        return modifier
    }

    async updateModifiers(modifierDto: ModifierDto[]): Promise<string[]> {
        const modifierIds = await Promise.all(
            modifierDto.map(modifier => this.updateModifier(modifier))
          );
        return modifierIds;
    }

    async updateModifier(modifierDto: ModifierDto): Promise<string> {
        const modifier = modifierDto._id ? await this.modifierModel.findById(modifierDto._id) : new this.modifierModel();
        modifier.name = modifierDto.name;
        modifier.price = modifierDto.price
        await modifier.save();
        return modifier._id;
    }

    deleteModifiers(Ids: string[]) {
        for (const id of Ids) {
            this.deleteModifier(id);
        }
    }

    async deleteModifier(id: string) {
        const now = new Date(); 
        now.setTime(now.getTime() + (7 * 60 * 60 * 1000)); 
        await this.update(id, {
            deleted_at: now
        })  
    }
}