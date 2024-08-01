import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ReplyModule } from './reply/reply.module';
import { PostLikesModule } from './post-likes/post-likes.module';
import { CommentLikesModule } from './comment-likes/comment-likes.module';
import { ReplyLikesModule } from './reply-likes/reply-likes.module';
import * as cookie from 'cookie-parser';
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path";
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenEmptyGuard } from './auth/guards/token.guard';


@Module({
  // imports: [
  //   ConfigModule.forRoot({ isGlobal: true }),
  //   SequelizeModule.forRoot({
  //     dialect: "mysql",
  //     host: "localhost",
  //     port: parseInt(process.env.DB_PORT),
  //     username: process.env.DB_USERNAME,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_NAME,
  //     autoLoadModels: true,
  //     synchronize: true
  //   }),
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      database: "test",
      autoLoadModels: true,
      synchronize: true
    }),
    UserModule,
    PostModule,
    CommentModule,
    ReplyModule,
    PostLikesModule,
    CommentLikesModule,
    ReplyLikesModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "static"),
      exclude: ['/static/index.html'], // index.html 파일을 제외
    }), JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: "60m" }
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookie()).forRoutes("*");
  }
}
