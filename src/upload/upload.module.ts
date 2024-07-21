import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: UploadService,
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule { }
