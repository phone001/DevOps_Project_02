import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePost } from './dto/post.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostIdIsNumber } from './pipe/post.pipe';
import { logIntercepter } from 'src/intercepter/log.intercepter';

@ApiTags("Post")
@Controller('post')
@UseInterceptors(logIntercepter)
export class PostController {
  constructor(private readonly postService: PostService) { }

  // 글 작성(생성)
  @Post("/create")
  @ApiOperation({ summary: '게시글 생성' })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        content: { type: "string" },
        image: { type: "string", format: "binary" }
      }
    },
    description: "imgPath는 멀터가 처리중"
  })
  @UseInterceptors(FileInterceptor('file'))
  async createPost(@Body() createPostDTO: CreatePost, @Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    try {
      // const imgPath = "/imgs/post/" + file.filename;
      if (file) {
        createPostDTO.imgPath = file.filename;
      } else {
        createPostDTO.imgPath = null;
      }
      return await this.postService.createPost(createPostDTO, req);
    } catch (error) {
      return new BadRequestException("post request fail controller createPost", { cause: error, description: error.message });
    }
  }

  // 글 조회
  @Get("/:id")
  @ApiOperation({ summary: '게시글 조회' })
  async selectPostByIdForRandom(@Param("id", new PostIdIsNumber) postId: number) {
    try {
      return await this.postService.selectPostByIdForRandom(postId);
    } catch (error) {
      return new BadRequestException("post request fail controller selectPostByIdLimitTen", { cause: error, description: error.message });
    }
  }

  // 유저 아이디로 글 조회
  @Get("findPostByUser")
  @ApiOperation({ summary: '자신이 작성한 게시글 조회', description: "userId는 JWT복호화" })
  async selectPostByUserId(@Req() req: Request) {
    try {
      return await this.postService.selectPostByUserId(req);
    } catch (error) {
      return new BadRequestException("post request fail controller selectPostByUserId", { cause: error, description: error.message });
    }
  }

  // 검색어로 글 조회 쿼리스트링으로
  @Get("/search")
  @ApiOperation({ summary: '게시글 검색어 조회', description: "게시글 검색어로 삭제" })
  @ApiQuery({
    name: "searchTarget",
    required: true,
    description: "검색어"
  })
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
  @ApiOperation({ summary: '게시글 수정', description: "게시글 id로 수정" })
  @ApiBody({
    schema: {
      properties: {
        title: { type: "string" },
        content: { type: "string" },
      }
    },
    description: "imgPath는 멀터가 처리중"
  })
  @UseInterceptors(FileInterceptor('file'))
  async updatePostById(@Param("id", new PostIdIsNumber) postId: number, @Body() updatePostDTO: CreatePost, @Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    try {
      // 멀터 로직 확인 완료 후 변경하던지 말던지 결정해야 한다.
      // const imgPath = "/imgs/post/" + ;

      if (file) {
        updatePostDTO.imgPath = "/imgs/post/" + file.filename;
      } else {
        updatePostDTO.imgPath = null;
      }

      return await this.postService.updatePostById(postId, req, updatePostDTO);
    } catch (error) {
      return new BadRequestException("post request fail controller updatePostById", { cause: error, description: error.message });
    }
  }

  //글 삭제
  @Delete("/:id")
  @ApiOperation({ summary: '게시글 삭제', description: "게시글 id로 삭제" })
  async deletePostById(@Param("id", new PostIdIsNumber) postId: number, @Req() req: Request) {
    try {
      await this.postService.deletePostById(postId, req);
    } catch (error) {
      return new BadRequestException("post request fail controller deletePostById", { cause: error, description: error.message });
    }
  }
}
