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


}