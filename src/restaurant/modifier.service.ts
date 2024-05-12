import { BaseServiceAbstract } from "src/utils/repository/base.service";
import { Modifier } from "./entities/modifier.schema";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ModifierService extends BaseServiceAbstract<Modifier>{
    constructor(
        @InjectModel(Modifier.name) private readonly modifierModel: Model<Modifier>,

    ){
        super(modifierModel);
    }
}