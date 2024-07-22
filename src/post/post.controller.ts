import { Controller, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Post")
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get("/")
  async test() {
    // await this.postService.selectPostByIdLimitTen(1);
    const isExist = await this.postService.selectPostById(5);
    if (!isExist) {
      return "등록되지 않은 게시글입니다."
    }
    return await this.postService.selectPostByIdLimitTen(1);
  }

  @Get("/create")
  async createtest() {
    const test = { userId: 1, title: "123", content: "aaa", imgPath: "" }
    this.postService.createPost(test);
    return "생성완료";
  }
}
