import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CreateComment } from './dto/comment.dto';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './entities/comment.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment]),
    JwtModule.register({ secret: process.env.JWT_KEY })
  ]
  , controllers: [CommentController],
  providers: [CommentService, CreateComment],
})
export class CommentModule { }
