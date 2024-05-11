import { Prop } from '@nestjs/mongoose';

export class BaseEntity {
    _id?: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response
    
    @Prop({ default: null })
    deleted_at: Date; // Dùng cho soft delete
}