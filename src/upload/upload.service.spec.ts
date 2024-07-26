import { Test, TestingModule } from '@nestjs/testing';
import { UploadService1 } from './upload.service';

describe('UploadService', () => {
  let service: UploadService1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService1],
    }).compile();

    service = module.get<UploadService1>(UploadService1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
