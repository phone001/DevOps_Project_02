import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { CreateReply } from './dto/reply.dto';

@Module({
  controllers: [ReplyController],
  providers: [ReplyService, CreateReply],
})
export class ReplyModule { }
