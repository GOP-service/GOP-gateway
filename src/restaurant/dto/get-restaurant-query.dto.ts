import { IsOptional, IsString, IsMongoId, IsNumber, Min, Max, IsArray } from "class-validator";

export class GetRestaurantsQueryDto {
    @IsArray()
    coordinates: [number, number]; // Toạ độ địa lý (longitude, latitude)
    
    @IsOptional()
    @IsString()
    searchQuery?: string; 
  
    categoryId?: string; 
  
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1; 
  
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10; 
  }