import { Injectable } from "@nestjs/common";
import { ModifierGroup } from "./entities/modifier_groups.schema";
import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ModifierGroupService extends BaseServiceAbstract<ModifierGroup>{
    constructor(
        @InjectModel(ModifierGroup.name) private readonly modifieGroupModel: Model<ModifierGroup>,
    ){
        super(modifieGroupModel);
    }    
}