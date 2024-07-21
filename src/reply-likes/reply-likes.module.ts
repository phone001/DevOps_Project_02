import { Module } from '@nestjs/common';
import { ReplyLikesService } from './reply-likes.service';
import { ReplyLikesController } from './reply-likes.controller';
import { CreateReplyLikes } from './dto/replyLikes.dto';

@Module({
  controllers: [ReplyLikesController],
  providers: [ReplyLikesService, CreateReplyLikes],
})
export class ReplyLikesModule { }
