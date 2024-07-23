import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateComment } from './dto/comment.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CommentLikes } from 'src/comment-likes/entities/commentLikes.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment)
        private readonly commentModel: typeof Comment,
        private readonly jwt: JwtService
    ) { }

    // 댓글 생성
    async createComment(createComment: CreateComment, req: Request): Promise<Comment | BadRequestException> {
        try {
            const { postId, content } = createComment;
            const token = req.cookies("token");
            const { userId } = this.jwt.verify(token);
            return await this.commentModel.create({ postId, userId, content })
        } catch (error) {
            return new BadRequestException("comment request fail service createComment", { cause: error, description: error.message });
        }
    }

    // 좋아요 싫어요 로직
    async likeDislikeCalc(data: any) {
        data.forEach((e) => {
            let like = 0;
            let dislike = 0;
            const likedUserId = []
            e.dataValues["commentLikes"].forEach((e2) => {
                if (e2.dataValues["likes"]) {
                    like++
                } else {
                    dislike++
                }
                likedUserId.push(e2.dataValues["userId"]);
            })
            e.dataValues["postLikes"] = like;
            e.dataValues["postDislikes"] = dislike;
            e.dataValues["likedUserId"] = likedUserId;
        })
        return data;
    }

    // postId로 해당 글의 댓글 가져오기
    async selectCommentByPostId(postId: number): Promise<Comment | BadRequestException> {
        try {
            return await this.commentModel.findOne({ where: { postId }, include: [User] });
        } catch (error) {
            return new BadRequestException("comment request fail service selectCommentByPostId", { cause: error, description: error.message });
        }
    }

    // 댓글 조회
    async selectCommentByPostIdLimitTen(postId: number): Promise<Comment[] | BadRequestException | NotFoundException> {
        try {
            const isExist = await this.selectCommentByPostId(postId);
            if (!isExist) {
                return new NotFoundException("해당 게시글의 댓글 없음");
            }

            const data = await this.commentModel.findAll({ where: { postId }, limit: 20, include: [User, CommentLikes] });
            return this.likeDislikeCalc(data);
        } catch (error) {
            return new BadRequestException("comment request fail service selectCommentByPostIdLimitTen", { cause: error, description: error.message });
        }
    }

    // 댓글 수정
    async updateCommentById(id: number): Promise<Comment> {
        try {
            return
        } catch (error) {

        }
    }

    // 댓글 삭제
}
