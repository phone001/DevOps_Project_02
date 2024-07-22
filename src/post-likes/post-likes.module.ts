import { Module } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { PostLikesController } from './post-likes.controller';
import { CreatePostLikes } from './dto/postLikes.dto';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostLikes } from './entities/postLikes.entity';

@Module({
  imports: [SequelizeModule.forFeature([PostLikes])],
  controllers: [PostLikesController],
  providers: [PostLikesService, CreatePostLikes],
})
export class PostLikesModule { }
