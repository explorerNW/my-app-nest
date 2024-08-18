import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
    @Prop()
    name: String;

    @Prop()
    age: Number;

    @Prop()
    breed: String;

    @Prop()
    breeder: String;
}

export const CatSchema = SchemaFactory.createForClass(Cat);

export const CatSchemaNew = new mongoose.Schema({
    name: String,
    age: Number,
    breed: String,
    breeder: String,
});