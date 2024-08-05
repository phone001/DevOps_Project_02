import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Reply } from './entities/reply.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateReply } from './dto/reply.dto';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { ReplyLikes } from 'src/reply-likes/entitys/replyLikes.entity';

@Injectable()
export class ReplyService {
    constructor(
        @InjectModel(Reply)
        private readonly replyModel: typeof Reply,
        private readonly jwt: JwtService
    ) { }

    // 댓글 생성
    async createReply(createReply: CreateReply, req: Request): Promise<Reply | BadRequestException> {
        try {
            const { commentId, content } = createReply;
            const token = req.cookies["token"];
            const { userId } = this.jwt.verify(token);
            return await this.replyModel.create({ commentId, userId, content })
        } catch (error) {
            return new BadRequestException("reply request fail service createReply", { cause: error, description: error.message });
        }
    }


    // 대댓글 개수 commentId로 가져오기
    async selectReplyCountByCommentId(commentId: number): Promise<number> {
        try {
            return this.replyModel.count({ where: { commentId } });
        } catch (error) {

        }
    }


    // 좋아요 싫어요 로직
    async likeDislikeCalc(data: any) {
        data.forEach((e) => {
            let like = 0;
            let dislike = 0;
            const likedUserId = []
            const dislikedUserId = [];
            e.dataValues["replyLikes"].forEach((e2) => {
                if (e2.dataValues["likes"]) {
                    like++
                    likedUserId.push(e2.dataValues["userId"]);
                } else {
                    dislike++
                    dislikedUserId.push(e2.dataValues["userId"]);
                }
            })
            e.dataValues["replyLikes"] = like;
            e.dataValues["replyDislikes"] = dislike;
            e.dataValues["likedUserId"] = likedUserId;
            e.dataValues["dislikedUserId"] = dislikedUserId;
        })
        return data;
    }

    // commentId로 해당 댓글의 대댓글 가져오기
    async selectReplyByCommentId(commentId: number): Promise<Reply | BadRequestException> {
        try {
            const data = await this.replyModel.findOne({ where: { commentId }, include: [User] });
            if (!data) {
                return new NotFoundException("해당 댓글의 대댓글 없음");
            }
            return data;
        } catch (error) {
            return new BadRequestException("reply request fail service selectReplyByCommentId", { cause: error, description: error.message });
        }
    }

    // 대댓글 조회
    // async selectReplyByCommentIdLimitTen(commentId: number): Promise<Reply[] | BadRequestException | NotFoundException> {
    //     try {
    //         const isExist = await this.selectReplyByCommentId(commentId);
    //         if (!isExist) {
    //             return new NotFoundException("해당 댓글의 대댓글 없음");
    //         }

    //         const data = await this.replyModel.findAll({ where: { commentId }, limit: 10, include: [User, ReplyLikes] });
    //         return this.likeDislikeCalc(data);
    //     } catch (error) {
    //         return new BadRequestException("reply request fail service selectReplyByCommentIdLimitTen", { cause: error, description: error.message });
    //     }
    // }


    // reply id로 댓글 가져오기
    async selectReplyById(id: number): Promise<Reply | BadRequestException> {
        try {
            return await this.replyModel.findOne({ where: { id }, include: [User] });
        } catch (error) {
            return new BadRequestException("reply request fail service selectReplyById", { cause: error, description: error.message });
        }
    }


    // 댓글 수정
    async updateReplyById(id: number, req: Request): Promise<[affectedCount: number] | UnauthorizedException | BadRequestException> {
        try {
            const token = req.cookies["token"];
            const { userId } = this.jwt.verify(token);

            const data = await this.selectReplyById(id);
            if (data["dataValues"].user.dataValues.id !== userId) {
                return new UnauthorizedException("작성자와 로그인된 유저 불일치");
            }

            const { content } = req.body;

            return await this.replyModel.update({ content }, { where: { id } });
        } catch (error) {
            return new BadRequestException("reply request fail service updateReplyById", { cause: error, description: error.message });
        }
    }

    // 댓글 삭제
    async deleteReplyById(id: number, req: Request): Promise<number | UnauthorizedException | BadRequestException> {
        try {
            const token = req.cookies["token"];
            const { userId } = this.jwt.verify(token);

            const data = await this.selectReplyById(id);
            if (data["dataValues"].user.dataValues.id !== userId) {
                return new UnauthorizedException("작성자와 로그인된 유저 불일치");
            }

            return await this.replyModel.destroy({ where: { id } });
        } catch (error) {
            return new BadRequestException("reply request fail service deleteReplyById", { cause: error, description: error.message });
        }
    }
}
