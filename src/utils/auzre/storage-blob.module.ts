import { Module } from '@nestjs/common';
import { AzureStorageService } from './storage-blob.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AzureStorageService],
  exports: [AzureStorageService],
})
export class AzureStorageModule {}
