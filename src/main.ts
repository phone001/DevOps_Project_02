import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:8000",
      "http://127.0.0.1:8000",
      "https://dropdot.shop",
      "http://dropdot.shop",
      "https://dropdot.shop:8000",
      "http://dropdot.shop:8000",
      "https://3.34.96.181",
      "http://3.34.96.181",
      "https://3.34.96.181:8000",
      "http://3.34.96.181:8000",
    ],
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
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
