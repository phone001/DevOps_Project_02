import { Module } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { PostLikesController } from './post-likes.controller';
import { CreatePostLikes } from './dto/postLikes.dto';

@Module({
  controllers: [PostLikesController],
  providers: [PostLikesService, CreatePostLikes],
})
export class PostLikesModule { }
