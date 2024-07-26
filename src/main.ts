import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: "http://localhost:8000",
    credentials: true
  });

  // Swagger 설정
  const config = new DocumentBuilder().setTitle("ergani API").setDescription("ergani api 문서입니다.").addTag("User").addTag("Post").addTag("Comment").addTag("Reply").addTag("PostLikes").addTag("CommentLikes").addTag("ReplyLikes").addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',
    },
    'access-token',
  ).build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
