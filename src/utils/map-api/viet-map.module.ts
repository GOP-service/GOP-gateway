import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { VietMapService } from "./viet-map.service";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        HttpModule.registerAsync({
            useFactory:async (configService: ConfigService) =>({
                baseURL: 'https://maps.vietmap.vn/api',
                params: {
                    apikey: configService.get<string>('VIETMAP_API_KEY')    
                }
                
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [VietMapService],
    exports: [VietMapService],
})
export class VietMapModule {}