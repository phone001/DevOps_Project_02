import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentLikes } from './entities/commentLikes.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class CommentLikesService {
    constructor(
        @InjectModel(CommentLikes)
        private readonly CommentLikeModel: typeof CommentLikes
    ) { }


    // 조회
    async selectCommentLikesByCommentIdUserId(commentId: number, userId: number): Promise<CommentLikes | BadRequestException> {
        try {
            return this.CommentLikeModel.findOne({ where: { [Op.and]: [{ commentId }, { userId }] } })
        } catch (error) {
            return new BadRequestException("commentLikes request fail service selectCommentLikesByCommentIdUserId", { cause: error, description: error.message });
        }
    }


    // 생성
    async createCommentLikes(commentId: number, userId: number, likes: boolean): Promise<CommentLikes | BadRequestException> {
        try {

            return await this.CommentLikeModel.create({ commentId, userId, likes });
        } catch (error) {
            return new BadRequestException("commentLikes request fail service createCommentLikes", { cause: error, description: error.message });
        }
    }

    // 수정
    async updateCommentLikesByCommentIdUserId(commentId: number, userId: number, likes: boolean): Promise<[affectedCount: number] | BadRequestException> {
        try {

            return this.CommentLikeModel.update({ likes }, { where: { [Op.and]: [{ commentId }, { userId }] } })
        } catch (error) {
            return new BadRequestException("commentLikes request fail service updateCommentLikesByCommentIdUserId", { cause: error, description: error.message });
        }
    }

    // 삭제
    async deleteCommentLikesByCommentIdUserId(commentId: number, userId: number): Promise<number | BadRequestException> {
        try {

            return this.CommentLikeModel.destroy({ where: { [Op.and]: [{ commentId }, { userId }] } });
        } catch (error) {
            return new BadRequestException("commentLikes request fail service deleteCommentLikesByCommentIdUserId", { cause: error, description: error.message });
        }
    }

}
