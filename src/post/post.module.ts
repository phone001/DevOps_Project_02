import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CreatePost } from './dto/post.dto';

@Module({
  controllers: [PostController],
  providers: [PostService, CreatePost],
})
export class PostModule { }
