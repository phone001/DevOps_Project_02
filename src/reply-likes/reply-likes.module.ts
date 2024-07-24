import { Module } from '@nestjs/common';
import { ReplyLikesService } from './reply-likes.service';
import { ReplyLikesController } from './reply-likes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReplyLikes } from './entitys/replyLikes.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([ReplyLikes]),
    JwtModule.register({ secret: process.env.JWT_KEY })
  ],
  controllers: [ReplyLikesController],
  providers: [ReplyLikesService],
})
export class ReplyLikesModule { }
