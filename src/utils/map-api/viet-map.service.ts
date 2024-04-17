import { Injectable } from "@nestjs/common";
import { LocationObject } from "../subschemas/location.schema";
import { VehicleType } from "../enums";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class VietMapService {
    constructor(
        private readonly httpService: HttpService
    ) {}
    
    async getDistanceNDuration(pickup: LocationObject, dropoff: LocationObject, type: VehicleType) {
        const vehicle = type === VehicleType.BIKE ? 'motorcycle' : 'car';

        const response = await firstValueFrom(this.httpService.get(
            `/route?point=${pickup.coordinates[1]},${pickup.coordinates[0]}
            &point=${dropoff.coordinates[1]},${dropoff.coordinates[0]}&vehicle=${vehicle}`
        )).then(res => res.data);
        
        return { distance: response.paths[0].distance, duration: response.paths[0].time};
    }
}