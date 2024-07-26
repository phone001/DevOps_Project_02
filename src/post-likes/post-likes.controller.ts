import { BadRequestException, Controller, Get, Param, Post, Req, UseInterceptors } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostIdIsNumber } from './pipe/post-likes.pipe';
import { JwtService } from '@nestjs/jwt';
import { logIntercepter } from 'src/intercepter/log.intercepter';

@ApiTags("PostLikes")
@Controller('post-likes')
export class PostLikesController {
  constructor(
    private readonly postLikesService: PostLikesService,
    private readonly jwt: JwtService
  ) { }

  @Post("/like/:postId")
  @UseInterceptors(logIntercepter)
  @ApiOperation({ summary: '게시글 좋아요 제어' })
  async likeControl(@Param("postId", new PostIdIsNumber) postId: number, @Req() req: Request) {
    try {

      const token = req.cookies["token"];
      const { userId } = this.jwt.verify(token);

      const isExist = this.postLikesService.selectPostLikesByPostIdUserId(postId, userId);

      // post-likes테이블에 존재하는지 확인 후 없으면 생성
      if (!isExist) {
        return this.postLikesService.createPostLikes(postId, userId, true);
      }

      // like 컬럼 true false판단 후 수정, 삭제
      if (isExist["dataValues"].likes) {
        return this.postLikesService.deletePostLikesByPostIdUserId(postId, userId);
      } else {
        return this.postLikesService.updatePostLikesByPostIdUserId(postId, userId, true);
      }

    } catch (error) {
      return new BadRequestException("postLikes request fail controller likeControl", { cause: error, description: error.message });
    }
  }

  @Post("/dislike/:postId")
  @ApiOperation({ summary: '게시글 싫어요 제어' })
  async dislikeControl(@Param("postId", new PostIdIsNumber) postId: number, @Req() req: Request) {
    try {

      const token = req.cookies["token"];
      const { userId } = this.jwt.verify(token);

      const isExist = this.postLikesService.selectPostLikesByPostIdUserId(postId, userId);

      // post-likes테이블에 존재하는지 확인 후 없으면 생성
      if (!isExist) {
        return this.postLikesService.createPostLikes(postId, userId, false);
      }

      // like 컬럼 true false판단 후 수정, 삭제
      if (!isExist["dataValues"].likes) {
        return this.postLikesService.deletePostLikesByPostIdUserId(postId, userId);
      } else {
        return this.postLikesService.updatePostLikesByPostIdUserId(postId, userId, false);
      }

    } catch (error) {
      return new BadRequestException("postLikes request fail controller dislikeControl", { cause: error, description: error.message });
    }
  }

}
