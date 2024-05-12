import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    _id: false,
    timestamps: false,
})
export class LocationObject{
    constructor(coordinates: number[] , address: string){
        this.coordinates = coordinates
        this.address = address
    }

    @Prop({ type: String, default: 'Point', required: true})
    type: string

    @Prop({ type: [Number], required: true })
    coordinates: number[]

    @Prop({ type: String })
    address: string

}

export const LocationSchema = SchemaFactory.createForClass(LocationObject);