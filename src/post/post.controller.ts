import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePost } from './dto/post.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostIdIsNumber } from './pipe/post.pipe';

@ApiTags("Post")
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  // 글 작성(생성)
  @Post("/create")
  @UseInterceptors(FileInterceptor('file'))
  async createPost(@Body() createPostDTO: CreatePost, @Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    try {
      return await this.postService.createPost(createPostDTO, req, file.path);
    } catch (error) {
      return new BadRequestException("post request fail controller createPost", { cause: error, description: error.message });
    }
  }

  // 글 조회
  @Get("/:id")
  async selectPostByIdLimitTen(@Param("id", new PostIdIsNumber) postId: number) {
    try {
      return await this.postService.selectPostByIdLimitTen(postId);
    } catch (error) {
      return new BadRequestException("post request fail controller selectPostByIdLimitTen", { cause: error, description: error.message });
    }
  }

  // 유저 아이디로 글 조회
  @Get("findPostByUser")
  async selectPostByUserId(@Req() req: Request) {
    try {
      return await this.postService.selectPostByUserId(req);
    } catch (error) {
      return new BadRequestException("post request fail controller selectPostByUserId", { cause: error, description: error.message });
    }
  }

  // 검색어로 글 조회 쿼리스트링으로
  @Get("/")
  async selectPostBySearchTargetLimitTen(@Query() query: any) {
    try {
      const { searchTarget } = query;
      if (!searchTarget) {
        return new BadRequestException("searchTarget 쿼리스트링 없음");
      }
      return await this.postService.selectPostBySearchTargetLimitTen(searchTarget);
    } catch (error) {
      return new BadRequestException("post request fail controller selectPostBySearchTargetLimitTen", { cause: error, description: error.message });
    }

  }

  // 글 수정
  @Put("/:id")
  @UseInterceptors(FileInterceptor('file'))
  async updatePostById(@Param("id", new PostIdIsNumber) postId: number, @Body() updatePostDTO: CreatePost, @Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    try {
      // 멀터 로직 확인 완료 후 변경하던지 말던지 결정해야 한다.
      const imgPath = "/imgs/post/" + file.path;
      return await this.postService.updatePostById(postId, req, imgPath);
    } catch (error) {
      return new BadRequestException("post request fail controller updatePostById", { cause: error, description: error.message });
    }
  }

  //글 삭제
  @Delete("/:id")
  async deletePostById(@Param("id", new PostIdIsNumber) postId: number, @Req() req: Request) {
    try {
      await this.postService.deletePostById(postId, req);
    } catch (error) {
      return new BadRequestException("post request fail controller deletePostById", { cause: error, description: error.message });
    }
  }
}
