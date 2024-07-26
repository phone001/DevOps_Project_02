import { Controller, Post, UploadedFile, UseInterceptors, Req, Inject } from "@nestjs/common";
import { UploadService1 } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";


@Controller('file')
export class UploadController {
  constructor(private readonly uploadService: UploadService1) {

  }

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
    return file;
  }
}