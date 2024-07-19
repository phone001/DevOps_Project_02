import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('file')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload/single')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}