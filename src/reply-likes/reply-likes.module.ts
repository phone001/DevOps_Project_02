import { Module } from '@nestjs/common';
import { ReplyLikesService } from './reply-likes.service';
import { ReplyLikesController } from './reply-likes.controller';
import { CreateReplyLikes } from './dto/replyLikes.dto';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReplyLikes } from './entitys/replyLikes.entity';

@Module({
  imports: [SequelizeModule.forFeature([ReplyLikes])],
  controllers: [ReplyLikesController],
  providers: [ReplyLikesService, CreateReplyLikes],
})
export class ReplyLikesModule { }
