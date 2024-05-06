import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBillDto } from './create-bill.dto';
import { IsString } from 'class-validator';

export class UpdateBillDto {
    id: string;
}
