import { Module } from '@nestjs/common';
import { UploadService1 } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: UploadService1,
    }),
  ],
  providers: [UploadService1],
  controllers: [UploadController],
})
export class UploadModule { }
