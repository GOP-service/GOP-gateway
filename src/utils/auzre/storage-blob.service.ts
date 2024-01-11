
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob'; 
import { Injectable } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config'; 

@Injectable() 
export class AzureStorageService {
    constructor(private readonly configService: ConfigService) {} 
    private containerName: string; 

    private async getBlobServiceInstance() { 
        const connectionString = this.configService.get('AZURE_STORAGE_CONNECTION_STRING'); 
        const blobClientService = await BlobServiceClient.fromConnectionString( connectionString, ); 
        return blobClientService; 
    } 

    private async getBlobClient(imageName: string): Promise<BlockBlobClient> {
        const blobService = await this.getBlobServiceInstance(); 
        const containerName = this.containerName; 
        const containerClient = blobService.getContainerClient(containerName); 
        const blockBlobClient = containerClient.getBlockBlobClient(imageName); 

        return blockBlobClient; 
    } 

    public async uploadFile(file: Express.Multer.File, containerName: string, id: string) { 
        this.containerName = containerName; 
        const extension = file.originalname.split('.').pop(); 
        const file_name = id + '.' + extension; 
        const blockBlobClient = await this.getBlobClient(file_name);
        const fileUrl = blockBlobClient.url; 
        await blockBlobClient.uploadData(file.buffer); 
        return fileUrl
    } 
} 