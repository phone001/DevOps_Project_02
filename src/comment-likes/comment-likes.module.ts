import { Module } from '@nestjs/common';
import { CommentLikesService } from './comment-likes.service';
import { CommentLikesController } from './comment-likes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentLikes } from './entities/commentLikes.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([CommentLikes]),
    JwtModule.register({ secret: process.env.JWT_KEY })
  ],
  controllers: [CommentLikesController],
  providers: [CommentLikesService],
})
export class CommentLikesModule { }
