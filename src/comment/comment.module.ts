import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CreateComment } from './dto/comment.dto';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CreateComment],
})
export class CommentModule { }
