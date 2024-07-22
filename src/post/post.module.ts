import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CreatePost } from './dto/post.dto';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService, CreatePost],
})
// providers에 CreatePost 주입 해야 하나요? 안해도 되는거죠?
// providers가 해주는 일?
export class PostModule { }
