import { Controller } from '@nestjs/common';
import { ReplyLikesService } from './reply-likes.service';

@Controller('reply-likes')
export class ReplyLikesController {
  constructor(private readonly replyLikesService: ReplyLikesService) {}
}
