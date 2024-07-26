import { BadRequestException, Injectable } from '@nestjs/common';
import { ReplyLikes } from './entitys/replyLikes.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class ReplyLikesService {
    constructor(
        @InjectModel(ReplyLikes)
        private readonly replyLikeModel: typeof ReplyLikes
    ) { }


    // 조회
    async selectReplyLikesByReplyIdUserId(replyId: number, userId: number): Promise<ReplyLikes | BadRequestException> {
        try {
            return this.replyLikeModel.findOne({ where: { [Op.and]: [{ replyId }, { userId }] } })
        } catch (error) {
            return new BadRequestException("replyLikes request fail service selectReplyLikesByReplyIdUserId", { cause: error, description: error.message });
        }
    }


    // 생성
    async createReplyLikes(replyId: number, userId: number, likes: boolean): Promise<ReplyLikes | BadRequestException> {
        try {
            return await this.replyLikeModel.create({ replyId, userId, likes });
        } catch (error) {
            return new BadRequestException("replyLikes request fail service createReplyLikes", { cause: error, description: error.message });
        }
    }

    // 수정
    async updateReplyLikesByReplyIdUserId(replyId: number, userId: number, likes: boolean): Promise<[affectedCount: number] | BadRequestException> {
        try {
            return this.replyLikeModel.update({ likes }, { where: { [Op.and]: [{ replyId }, { userId }] } })
        } catch (error) {
            return new BadRequestException("replyLikes request fail service updateReplyLikesByReplyIdUserId", { cause: error, description: error.message });
        }
    }

    // 삭제
    async deleteReplyLikesByReplyIdUserId(replyId: number, userId: number): Promise<number | BadRequestException> {
        try {
            return this.replyLikeModel.destroy({ where: { [Op.and]: [{ replyId }, { userId }] } });
        } catch (error) {
            return new BadRequestException("replyLikes request fail service deleteReplyLikesByReplyIdUserId", { cause: error, description: error.message });
        }
    }
}
