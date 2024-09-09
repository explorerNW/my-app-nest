import { Module } from '@nestjs/common';
import { FileUploadService } from './service/file-upload.service';
import { FileUploadController } from './controller/file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './file-db.schema';
import { FileController } from './controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: resolve(__dirname, '../file-uploads'),
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  providers: [FileUploadService],
  controllers: [FileUploadController, FileController]
})
export class FileUploadModule {}
