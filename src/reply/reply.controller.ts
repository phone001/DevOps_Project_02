import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CommentIdIsNumber, ReplyIdIsNumber } from './pipe/reply.pipe';
import { Request } from 'express';
import { CreateReply } from './dto/reply.dto';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Reply } from './entities/reply.entity';
import { logIntercepter } from 'src/intercepter/log.intercepter';

@ApiTags("Reply")
@Controller('reply')
@UseInterceptors(logIntercepter)
export class ReplyController {
  constructor(private readonly replyService: ReplyService) { }

  @Post("createReply")
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
      return new BadRequestException("comment request fail controller createComment", { cause: error, description: error.message });
    }
  }

  @Get("/:commentId")
  @ApiOperation({ summary: '대댓글 조회', description: "대댓글 commentId로 10개 조회" })
  @ApiParam({
    name: "commentId",
    example: "1",
    required: true
  })
  async selectCommentByCommentIdLimitTen(@Param("commentId", new ReplyIdIsNumber) commentId) {
    try {
      return await this.replyService.selectReplyByCommentIdLimitTen(commentId);
    } catch (error) {
      return new BadRequestException("comment request fail controller selectCommentByCommentIdLimitTen", { cause: error, description: error.message });
    }
  }

  @Put("/:id")
  @ApiOperation({ summary: '대댓글 수정', description: "대댓글 id로 수정" })
  @ApiBody({
    schema: {
      properties: { content: { type: "string" } }
    }
  })
  async updateCommentById(@Param("id", new CommentIdIsNumber) id: number, @Req() req: Request) {
    try {
      return this.replyService.updateReplyById(id, req);
    } catch (error) {
      return new BadRequestException("comment request fail controller updateCommentById", { cause: error, description: error.message });
    }
  }

  @Delete("/:id")
  @ApiOperation({ summary: '대댓글 삭제', description: "대댓글 id로 삭제" })
  async deleteCommentById(@Param("id", new CommentIdIsNumber) id: number, @Req() req: Request) {
    try {
      await this.replyService.deleteReplyById(id, req);
    } catch (error) {
      return new BadRequestException("comment request fail controller deleteCommentById", { cause: error, description: error.message });
    }
  }
}
