import { Module } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { PostLikesController } from './post-likes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostLikes } from './entities/postLikes.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([PostLikes]),
    JwtModule.register({ secret: process.env.JWT_KEY })
  ],
  controllers: [PostLikesController],
  providers: [PostLikesService],
})
export class PostLikesModule { }
