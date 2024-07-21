import { Module } from '@nestjs/common';
import { CommentLikesService } from './comment-likes.service';
import { CommentLikesController } from './comment-likes.controller';
import { CreateCommentLikes } from './dto/commentLikes.dto';

@Module({
  controllers: [CommentLikesController],
  providers: [CommentLikesService, CreateCommentLikes],
})
export class CommentLikesModule { }
