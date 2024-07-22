import { Module } from '@nestjs/common';
import { CommentLikesService } from './comment-likes.service';
import { CommentLikesController } from './comment-likes.controller';
import { CreateCommentLikes } from './dto/commentLikes.dto';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentLikes } from './entities/commentLikes.entity';

@Module({
  imports: [SequelizeModule.forFeature([CommentLikes])],
  controllers: [CommentLikesController],
  providers: [CommentLikesService, CreateCommentLikes],
})
export class CommentLikesModule { }
