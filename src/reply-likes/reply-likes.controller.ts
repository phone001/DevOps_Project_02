import { BadRequestException, Controller, Param, Post, Req, UseInterceptors } from '@nestjs/common';
import { ReplyLikesService } from './reply-likes.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ReplyIdIsNumber } from './pipe/reply-likes.pipe';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { logIntercepter } from 'src/intercepter/log.intercepter';

@ApiTags("ReplyLikes")
@Controller('reply-likes')
@UseInterceptors(logIntercepter)
export class ReplyLikesController {
  constructor(
    private readonly replyLikesService: ReplyLikesService,
    private readonly jwt: JwtService
  ) { }

  @Post("/like/:replyId")
  @ApiOperation({ summary: '대댓글 좋아요 제어' })
  async likeControl(@Param("replyId", new ReplyIdIsNumber) replyId: number, @Req() req: Request) {
    try {

      const token = req.cookies["token"];
      const { userId } = this.jwt.verify(token);

      const isExist = await this.replyLikesService.selectReplyLikesByReplyIdUserId(replyId, userId);

      // reply-likes테이블에 존재하는지 확인 후 없으면 생성
      if (!isExist) {
        return await this.replyLikesService.createReplyLikes(replyId, userId, true);
      }

      // like 컬럼 true false판단 후 수정, 삭제
      if (isExist["dataValues"].likes) {
        return await this.replyLikesService.deleteReplyLikesByReplyIdUserId(replyId, userId);
      } else {
        return await this.replyLikesService.updateReplyLikesByReplyIdUserId(replyId, userId, true);
      }

    } catch (error) {
      return new BadRequestException("replyLikes request fail controller likeControl", { cause: error, description: error.message });
    }
  }

  @Post("/dislike/:replyId")
  @ApiOperation({ summary: '대댓글 싫어요 제어' })
  async dislikeControl(@Param("replyId", new ReplyIdIsNumber) replyId: number, @Req() req: Request) {
    try {

      const token = req.cookies["token"];
      const { userId } = this.jwt.verify(token);

      const isExist = await this.replyLikesService.selectReplyLikesByReplyIdUserId(replyId, userId);

      // reply-likes테이블에 존재하는지 확인 후 없으면 생성
      if (!isExist) {
        return await this.replyLikesService.createReplyLikes(replyId, userId, false);
      }

      // like 컬럼 true false판단 후 수정, 삭제
      if (!isExist["dataValues"].likes) {
        return await this.replyLikesService.deleteReplyLikesByReplyIdUserId(replyId, userId);
      } else {
        return await this.replyLikesService.updateReplyLikesByReplyIdUserId(replyId, userId, false);
      }

    } catch (error) {
      return new BadRequestException("replyLikes request fail controller dislikeControl", { cause: error, description: error.message });
    }
  }
}
