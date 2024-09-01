import { Body, Controller, InternalServerErrorException, Param, Post, Request, UploadedFile, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileDto, FileUploadService } from '../service';
import { Types } from 'mongoose';

@Controller('file')
@UseGuards(AuthGuard)
export class FileUploadController {

    constructor(private fileUploadService: FileUploadService) {}

    @Post('upload')
    @ApiTags('file')
    @ApiConsumes('multipart/form-data')
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Request() req) {
        try {
            const data: FileDto = await req.file();
            return this.fileUploadService.uploadFile(data);
        } catch (e) {
            return {
                error: new InternalServerErrorException(e)
            }
        }
    }

    @Post('download/:id')
    downloadFile(@Param('id') fileId: Types.ObjectId) {
        return this.fileUploadService.downloadFile(fileId);
    }

    @Post('download')
    downloadFileByName(@Body('name') fileName: string){
        return this.fileUploadService.downloadFileByName(fileName);
    }
}
