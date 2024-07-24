import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostLikes } from './entities/postLikes.entity';
import { Op } from 'sequelize';

@Injectable()
export class PostLikesService {
    constructor(
        @InjectModel(PostLikes)
        private readonly postLikeModel: typeof PostLikes
    ) { }


    // 조회
    async selectPostLikesByPostIdUserId(postId: number, userId: number): Promise<PostLikes | BadRequestException> {
        try {
            return this.postLikeModel.findOne({ where: { [Op.and]: [{ postId }, { userId }] } })
        } catch (error) {
            return new BadRequestException("postLikes request fail service selectPostLikesByPostIdUserId", { cause: error, description: error.message });
        }
    }


    // 생성
    async createPostLikes(postId: number, userId: number, likes: boolean): Promise<PostLikes | BadRequestException> {
        try {

            return await this.postLikeModel.create({ postId, userId, likes });
        } catch (error) {
            return new BadRequestException("postLikes request fail service createPostLikes", { cause: error, description: error.message });
        }
    }

    // 수정
    async updatePostLikesByPostIdUserId(postId: number, userId: number, likes: boolean): Promise<[affectedCount: number] | BadRequestException> {
        try {

            return this.postLikeModel.update({ likes }, { where: { [Op.and]: [{ postId }, { userId }] } })
        } catch (error) {
            return new BadRequestException("postLikes request fail service updatePostLikesByPostIdUserId", { cause: error, description: error.message });
        }
    }

    // 삭제
    async deletePostLikesByPostIdUserId(postId: number, userId: number): Promise<number | BadRequestException> {
        try {

            return this.postLikeModel.destroy({ where: { [Op.and]: [{ postId }, { userId }] } });
        } catch (error) {
            return new BadRequestException("postLikes request fail service deletePostLikesByPostIdUserId", { cause: error, description: error.message });
        }
    }
}
