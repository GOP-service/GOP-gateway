import { OrderType } from "src/utils/enums"

export class ReviewDto {
    reviewable_id: string
    owner_id: string
    content: string
    rating: number
}
