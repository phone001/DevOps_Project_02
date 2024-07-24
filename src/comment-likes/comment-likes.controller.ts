import { BadRequestException, Controller, Param, Post, Req } from '@nestjs/common';
import { CommentLikesService } from './comment-likes.service';
import { JwtService } from '@nestjs/jwt';
import { CommentIdIsNumber } from './pipe/comment-likes.pipe';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("CommentLikes")
@Controller('comment-likes')
export class CommentLikesController {
  constructor(
    private readonly commentLikesService: CommentLikesService,
    private readonly jwt: JwtService
  ) { }

  @Post("/like/:commentId")
  @ApiOperation({ summary: '댓글 좋아요 제어' })
  async likeControl(@Param("commentId", new CommentIdIsNumber) commentId: number, @Req() req: Request) {
    try {

      const token = req.cookies["token"];
      const { userId } = this.jwt.verify(token);

      const isExist = this.commentLikesService.selectCommentLikesByCommentIdUserId(commentId, userId);

      // comment-likes테이블에 존재하는지 확인 후 없으면 생성
      if (!isExist) {
        return this.commentLikesService.createCommentLikes(commentId, userId, true);
      }

      // like 컬럼 true false판단 후 수정, 삭제
      if (isExist["dataValues"].likes) {
        return this.commentLikesService.deleteCommentLikesByCommentIdUserId(commentId, userId);
      } else {
        return this.commentLikesService.updateCommentLikesByCommentIdUserId(commentId, userId, true);
      }

    } catch (error) {
      return new BadRequestException("commentLikes request fail controller likeControl", { cause: error, description: error.message });
    }
  }

  @Post("/dislike/:commentId")
  @ApiOperation({ summary: '댓글 싫어요 제어' })
  async dislikeControl(@Param("commentId", new CommentIdIsNumber) commentId: number, @Req() req: Request) {
    try {

      const token = req.cookies["token"];
      const { userId } = this.jwt.verify(token);

      const isExist = this.commentLikesService.selectCommentLikesByCommentIdUserId(commentId, userId);

      // comment-likes테이블에 존재하는지 확인 후 없으면 생성
      if (!isExist) {
        return this.commentLikesService.createCommentLikes(commentId, userId, false);
      }

      // like 컬럼 true false판단 후 수정, 삭제
      if (!isExist["dataValues"].likes) {
        return this.commentLikesService.deleteCommentLikesByCommentIdUserId(commentId, userId);
      } else {
        return this.commentLikesService.updateCommentLikesByCommentIdUserId(commentId, userId, false);
      }

    } catch (error) {
      return new BadRequestException("commentLikes request fail controller dislikeControl", { cause: error, description: error.message });
    }
  }

}
