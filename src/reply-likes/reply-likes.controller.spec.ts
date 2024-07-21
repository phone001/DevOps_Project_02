import { Test, TestingModule } from '@nestjs/testing';
import { ReplyLikesController } from './reply-likes.controller';
import { ReplyLikesService } from './reply-likes.service';

describe('ReplyLikesController', () => {
  let controller: ReplyLikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReplyLikesController],
      providers: [ReplyLikesService],
    }).compile();

    controller = module.get<ReplyLikesController>(ReplyLikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
