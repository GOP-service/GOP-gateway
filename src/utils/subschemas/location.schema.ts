import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema()
export class Coordinates{
    @Prop({ default: 106.77195728296408})
    lat: number

    @Prop({ default: 10.850739590040357})
    long: number
}

export const CoordinatesSchema = SchemaFactory.createForClass(Coordinates);