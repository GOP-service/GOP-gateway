import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    _id: false,
    timestamps: true,
})
export class Coordinates{
    constructor(lat = 106.77195728296408, long = 10.850739590040357){
        this.lat = lat;
        this.long = long;
    }

    @Prop({ })
    lat: number

    @Prop({ })
    long: number
}

export const CoordinatesSchema = SchemaFactory.createForClass(Coordinates);