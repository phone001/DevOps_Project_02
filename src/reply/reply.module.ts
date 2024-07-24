import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { CreateReply } from './dto/reply.dto';
import { SequelizeModule } from '@nestjs/sequelize';
import { Reply } from './entities/reply.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Reply]),
    JwtModule.register({ secret: process.env.JWT_KEY })
  ],
  controllers: [ReplyController],
  providers: [ReplyService, CreateReply],
})
export class ReplyModule { }
