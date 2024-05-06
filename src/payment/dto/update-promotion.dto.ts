import { IsNotEmpty } from "class-validator";
import { PromotionDto } from "./promotion.dto";

export class UpdatePromotionDto extends PromotionDto{
    @IsNotEmpty()
    id: string
}