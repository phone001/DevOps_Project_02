import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CommentIdIsNumber, ReplyIdIsNumber } from './pipe/reply.pipe';
import { Request } from 'express';
import { CreateReply } from './dto/reply.dto';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Reply } from './entities/reply.entity';
import { logIntercepter } from 'src/intercepter/log.intercepter';
import { TokenEmptyGuard } from 'src/auth/guards/token.guard';

@ApiTags("Reply")
@Controller('reply')
@UseInterceptors(logIntercepter)
export class ReplyController {
  constructor(private readonly replyService: ReplyService) { }

  @Post("createReply")
  @UseGuards(TokenEmptyGuard)
  @ApiOperation({ summary: '대댓글 생성' })
  @ApiBody({
    schema: {
      properties: {
        commentId: { type: "number" },
        content: { type: "string" }
      }
    },
    description: "imgPath는 멀터가 처리중"
  })
  async createComment(@Body() createReplyDTO: CreateReply, @Req() req: Request) {
    try {
      return await this.replyService.createReply(createReplyDTO, req);
    } catch (error) {
      return new BadRequestException("reply request fail controller createComment", { cause: error, description: error.message });
    }
  }


  @Get("/count/:commentId")
  @ApiOperation({ summary: '대댓글 개수 commentId로 조회' })
  @ApiParam({
    name: "commentId",
    example: "1",
    required: true
  })
  async selectReplyCountByCommentId(@Param("commentId", new CommentIdIsNumber) commentId: number) {
    try {
      return await this.replyService.selectReplyCountByCommentId(commentId);
    } catch (error) {
      return new BadRequestException("reply request fail controller selectReplyCountByCommentId", { cause: error, description: error.message });
    }
  }


  @Get("/:commentId")
  @ApiOperation({ summary: '대댓글 조회', description: "대댓글 commentId로 조회" })
  @ApiParam({
    name: "commentId",
    example: "1",
    required: true
  })
  async selectReplyByCommentId(@Param("commentId", new ReplyIdIsNumber) commentId) {
    try {
      return await this.replyService.selectReplyByCommentId(commentId);
    } catch (error) {
      return new BadRequestException("reply request fail controller selectReplyByCommentIdLimitTen", { cause: error, description: error.message });
    }
  }

  @Put("/:id")
  @UseGuards(TokenEmptyGuard)
  @ApiOperation({ summary: '대댓글 수정', description: "대댓글 id로 수정" })
  @ApiBody({
    schema: {
      properties: { content: { type: "string" } }
    }
  })
  async updateReplyById(@Param("id", new CommentIdIsNumber) id: number, @Req() req: Request) {
    try {
      return this.replyService.updateReplyById(id, req);
    } catch (error) {
      return new BadRequestException("reply request fail controller updateReplyById", { cause: error, description: error.message });
    }
  }

  @Delete("/:id")
  @UseGuards(TokenEmptyGuard)
  @ApiOperation({ summary: '대댓글 삭제', description: "대댓글 id로 삭제" })
  async deleteCommentById(@Param("id", new CommentIdIsNumber) id: number, @Req() req: Request) {
    try {
      await this.replyService.deleteReplyById(id, req);
    } catch (error) {
      return new BadRequestException("reply request fail controller deleteCommentById", { cause: error, description: error.message });
    }
  }
}
