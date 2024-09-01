import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class File extends Document {
    @Prop()
    fileName: String;

    @Prop()
    fileData: Buffer;
}

export const FileSchema = SchemaFactory.createForClass(File);