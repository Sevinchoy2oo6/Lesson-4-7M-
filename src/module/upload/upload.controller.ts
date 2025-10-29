import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { message: 'No file uploaded!' };

    return {
      message: 'Single file uploaded successfully!',
      fileName: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) 
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) return { message: 'No files uploaded!' };

    return {
      message: 'Multiple files uploaded successfully!',
      count: files.length,
      files: files.map((file) => ({
        fileName: file.filename,
        path: `/uploads/${file.filename}`,
      })),
    };
  }
}

