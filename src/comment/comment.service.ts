import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
            const token = req.cookies["token"];
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
            const dislikedUserId = [];
            e.dataValues["commentLikes"].forEach((e2) => {
                if (e2.dataValues["likes"]) {
                    like++
                    likedUserId.push(e2.dataValues["userId"]);
                } else {
                    dislike++
                    dislikedUserId.push(e2.dataValues["userId"]);
                }
            })
            e.dataValues["commentLikes"] = like;
            e.dataValues["commentDislikes"] = dislike;
            e.dataValues["likedUserId"] = likedUserId;
            e.dataValues["dislikedUserId"] = dislikedUserId;
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

            const data = await this.commentModel.findAll({ where: { postId }, limit: 10, include: [User, CommentLikes] });
            return this.likeDislikeCalc(data);
        } catch (error) {
            return new BadRequestException("comment request fail service selectCommentByPostIdLimitTen", { cause: error, description: error.message });
        }
    }

    // comment id로 댓글 가져오기
    async selectCommentById(id: number): Promise<Comment | BadRequestException> {
        try {
            return await this.commentModel.findOne({ where: { id }, include: [User] });
        } catch (error) {
            return new BadRequestException("comment request fail service selectCommentByPostId", { cause: error, description: error.message });
        }
    }


    // 댓글 수정
    async updateCommentById(id: number, req: Request): Promise<[affectedCount: number] | UnauthorizedException | BadRequestException> {
        try {
            const token = req.cookies["token"];
            const { userId } = this.jwt.verify(token);

            const data = await this.selectCommentById(id);
            if (data["dataValues"].user.dataValues.id !== userId) {
                return new UnauthorizedException("작성자와 로그인된 유저 불일치");
            }

            const { content } = req.body;

            return await this.commentModel.update({ content }, { where: { id } });
        } catch (error) {
            return new BadRequestException("comment request fail service updateCommentById", { cause: error, description: error.message });
        }
    }

    // 댓글 삭제
    async deleteCommentById(id: number, req: Request): Promise<number | UnauthorizedException | BadRequestException> {
        try {
            const token = req.cookies["token"];
            const { userId } = this.jwt.verify(token);

            const data = await this.selectCommentById(id);
            if (data["dataValues"].user.dataValues.id !== userId) {
                return new UnauthorizedException("작성자와 로그인된 유저 불일치");
            }

            return await this.commentModel.destroy({ where: { id } });
        } catch (error) {
            return new BadRequestException("comment request fail service deleteCommentById", { cause: error, description: error.message });
        }
    }
}
