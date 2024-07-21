import { Test, TestingModule } from '@nestjs/testing';
import { ReplyLikesService } from './reply-likes.service';

describe('ReplyLikesService', () => {
  let service: ReplyLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReplyLikesService],
    }).compile();

    service = module.get<ReplyLikesService>(ReplyLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
