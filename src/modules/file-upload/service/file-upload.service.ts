import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { File } from '../file-db.schema';
import { InjectModel } from '@nestjs/mongoose';
import { GridFSBucket } from 'mongodb';
import * as util from 'util';
import { pipeline } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { GridFSBucketReadStream } from 'typeorm';

export type FileDto = { file: Buffer, filename: string, toBuffer: Function };

@Injectable()
export class FileUploadService {

    private bucket: GridFSBucket;

    constructor(@InjectModel(File.name) private fileModel: Model<File>) {
        const database = this.fileModel.db.db;
        this.bucket = new GridFSBucket(database);
    }

    async uploadFile(file: FileDto) {
        try {
            const buffer = await file.toBuffer();

            const pump = util.promisify(pipeline);
            const tempPath = `${path.join(__dirname)}/${file.filename}`;
            await pump(file.file, fs.createWriteStream(tempPath));
            const uploadStream = this.bucket.openUploadStream(file.filename);
            const readStream = fs.createReadStream(tempPath);
            await uploadStream.write(buffer);
    
            return new Promise((resolve, reject)=>{
                const streamPip = readStream.pipe(uploadStream);
                streamPip.on('finish', (res)=>{
                    fs.unlink(tempPath, ()=>{
                        resolve({ success: true, file_name: file.filename, file_id: uploadStream.id });
                    });
                });
                streamPip.on('error', (err) => {
                    reject({ success: false, message: err });
                });
            });
        } catch(err) {
            return { success: false, message: err };
        }
    }

    private downloadHandler(downloadStream: GridFSBucketReadStream) {
        return new Promise((resolve, reject)=>{
            const chuncks = [];
            downloadStream.on('data', (chunck)=>{ chuncks.push(chunck) });
            downloadStream.on('error', (err) => {
                reject({ success: false, message: err });
            });
            downloadStream.on('end', async() => {
                resolve({ success: true, data: Buffer.concat(chuncks), content: chuncks.toString() });
            });
        });
    }

    downloadFile(fileId: Types.ObjectId) {
        try {
            const downloadStream = this.bucket.openDownloadStream(new Types.ObjectId(fileId));
            return this.downloadHandler(downloadStream);
        } catch(err) {
            return { success: false, message: err };
        }
    }

    downloadFileByName(filename: string) {
        try {
            const downloadStream = this.bucket.openDownloadStreamByName(filename);
            return this.downloadHandler(downloadStream);
        } catch(err) {
            return { success: false, message: err };
        }
    }
}
