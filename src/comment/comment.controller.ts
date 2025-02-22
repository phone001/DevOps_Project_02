import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateComment } from './dto/comment.dto';
import { Request } from 'express';
import { CommentIdIsNumber, PostIdIsNumber } from './pipe/comment.pipe';
import { logIntercepter } from 'src/intercepter/log.intercepter';
import { TokenEmptyGuard } from 'src/auth/guards/token.guard';

@ApiTags("Comment")
@Controller('comment')
@UseInterceptors(logIntercepter)
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Get("/count/:postId")
  @ApiOperation({ summary: '댓글 개수 postId로 조회' })
  @ApiParam({
    name: "postId",
    example: "1",
    required: true
  })
  async selectCommentCountByPostId(@Param("postId", new PostIdIsNumber) postId: number) {
    try {
      return await this.commentService.selectCommentCountByPostId(postId);
    } catch (error) {
      return new BadRequestException("comment request fail controller selectCommentCountByPostId", { cause: error, description: error.message });
    }
  }


  @Get("/:postId")
  @ApiOperation({ summary: '댓글 조회', description: "댓글 postId로 조회" })
  @ApiParam({
    name: "postId",
    example: "1",
    required: true
  })
  async selectCommentByPostId(@Param("postId", new PostIdIsNumber) postId: number) {
    try {
      return await this.commentService.selectCommentByPostId(postId);
    } catch (error) {
      return new BadRequestException("comment request fail controller selectCommentByPostIdLimitTen", { cause: error, description: error.message });
    }
  }


  @Post("createComment")
  @UseGuards(TokenEmptyGuard)
  @ApiOperation({ summary: '댓글 생성' })
  @ApiBody({
    schema: {
      properties: {
        postId: { type: "number" }
        , content: { type: "string" }
      }
    },
    description: "imgPath는 멀터가 처리중"
  })
  async createComment(@Body() createCommentDTO: CreateComment, @Req() req: Request) {
    try {
      return await this.commentService.createComment(createCommentDTO, req);
    } catch (error) {
      return new BadRequestException("comment request fail controller createComment", { cause: error, description: error.message });
    }
  }


  @Put("/:id")
  @UseGuards(TokenEmptyGuard)
  @ApiOperation({ summary: '댓글 수정', description: "댓글 id로 수정" })
  @ApiBody({
    schema: {
      properties: { content: { type: "string" } }
    }
  })
  async updateCommentById(@Param("id", new CommentIdIsNumber) id: number, @Req() req: Request) {
    try {
      return this.commentService.updateCommentById(id, req);
    } catch (error) {
      return new BadRequestException("comment request fail controller updateCommentById", { cause: error, description: error.message });
    }
  }


  @Delete("/:id")
  @UseGuards(TokenEmptyGuard)
  @ApiOperation({ summary: '댓글 삭제', description: "댓글 id로 삭제" })
  async deleteCommentById(@Param("id", new CommentIdIsNumber) id: number, @Req() req: Request) {
    try {
      await this.commentService.deleteCommentById(id, req);
    } catch (error) {
      return new BadRequestException("comment request fail controller deleteCommentById", { cause: error, description: error.message });
    }
  }
}
