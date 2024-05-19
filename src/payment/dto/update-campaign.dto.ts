import { IsNotEmpty } from "class-validator";
import { CampaignDto } from "./compaign.dto";

export class UpdateCampaignnDto extends CampaignDto{
    @IsNotEmpty()
    id: string
}