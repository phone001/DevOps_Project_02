import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserRepository } from './User.Repository';
import { UserModel } from './User.Model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload/upload.service';
import { TokenEmptyGuard, TokenExistGuard } from 'src/auth/guards/token.guard';
import { PostModule } from 'src/post/post.module';
import { CommentModule } from 'src/comment/comment.module';
import { ReplyModule } from 'src/reply/reply.module';
import { PostLikesModule } from 'src/post-likes/post-likes.module';
import { CommentLikes } from 'src/comment-likes/entities/commentLikes.entity';
import { ReplyLikesModule } from 'src/reply-likes/reply-likes.module';
import { CommentLikesModule } from 'src/comment-likes/comment-likes.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  SequelizeModule.forFeature([User]),
  JwtModule.register({
    secret: process.env.JWT_KEY,
    signOptions: { expiresIn: "60m" }
  }),
  MulterModule.registerAsync({
    useClass: UploadService,
  }), PostModule, CommentModule, ReplyModule, PostLikesModule, CommentLikesModule, ReplyLikesModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserRepository, UserModel, TokenEmptyGuard, TokenExistGuard],
})
export class UserModule { }
