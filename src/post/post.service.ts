import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';
import { CreatePost } from './dto/post.dto';
import { Op } from 'sequelize';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { PostLikes } from 'src/post-likes/entities/postLikes.entity';
import * as fs from 'fs';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post)
        private readonly postModel: typeof Post,
        private readonly jwt: JwtService
    ) { }

    // 게시글 생성

    async createPost(createPost: CreatePost, req: Request): Promise<Post | BadRequestException> {
        try {
            const { title, content, imgPath } = createPost
            const token = req.cookies["token"];
            const { userId } = this.jwt.verify(token);

            // 아마 이미지 없으면 에러날지도? 에러 난다면 다시 작업

            return await this.postModel.create({ userId, title, content, imgPath });
        } catch (error) {
            return new BadRequestException("post request fail service createPost", { cause: error, description: error.message });
        }
    }

    // 좋아요 싫어요 로직
    async likeDislikeCalcForPostArr(data: any) {
        data.forEach((e) => {
            let like = 0;
            let dislike = 0;
            const likedUserId = []
            const dislikedUserId = [];
            console.log(e.dataValues);
            e.dataValues["postLikes"].forEach((e2) => {
                if (e2.dataValues["likes"]) {
                    console.log(e.dataValues["likes"]);
                    like++
                    likedUserId.push(e2.dataValues["userId"]);
                } else {
                    dislike++
                    dislikedUserId.push(e2.dataValues["userId"]);
                }
            })
            e.dataValues["postLikes"] = like;
            e.dataValues["postDislikes"] = dislike;
            e.dataValues["likedUserId"] = likedUserId;
            e.dataValues["dislikedUserId"] = dislikedUserId;
        })
        return data;
    }


    // id로 해당 글 가져오기
    selectPostById = async (id: number): Promise<Post | BadRequestException> => {
        try {
            // const data = await this.postModel.findOne({ where: { id }, include: [User] });
            // console.log(data["dataValues"].user.dataValues.imgPath)
            return await this.postModel.findOne({ where: { id }, include: [User] });
        } catch (error) {
            return new BadRequestException("post request fail service selectPostById", { cause: error, description: error.message });
        }
    }

    async likeDislikeCalcForPost(data: any) {
        const postLikes = data.dataValues.postLikes;
        let like = 0;
        let dislike = 0;
        const likedUserId = [];
        const dislikedUserId = [];
        postLikes.forEach(el => {
            if (el.dataValues.likes) {
                like++;
                likedUserId.push(el.dataValues.userId);
            } else {
                dislike++;
                dislikedUserId.push(el.dataValues.userId);
            }
        });
        data.dataValues.postLikes = like;
        data.dataValues.postDisLikes = dislike;
        data.dataValues.likedUserId = likedUserId;
        data.dataValues.dislikedUserId = dislikedUserId;
        return data
    }

    // id로 해당 글 가져오기(random)
    selectPostByIdForRandom = async (id: number): Promise<Post | BadRequestException> => {
        try {
            const data = await this.postModel.findOne({ where: { id }, include: [User, PostLikes] });
            // console.log(data);
            return this.likeDislikeCalcForPost(data);
        } catch (error) {
            return new BadRequestException("post request fail service selectPostById", { cause: error, description: error.message });
        }
    }

    // id로 10개씩 가져오기
    selectPostByIdLimitTen = async (id: number): Promise<Post[] | BadRequestException | NotFoundException> => {
        try {
            const isExist = await this.selectPostById(id);
            if (!isExist) {
                // 404
                return new NotFoundException("post not exist");
            }
            const data = await this.postModel.findAll({ where: { id: { [Op.gte]: id } }, limit: 10, include: [User, PostLikes] });
            return this.likeDislikeCalcForPostArr(data);

        } catch (error) {
            // 400
            return new BadRequestException("post request fail service selectPostByIdLimitTen", { cause: error, description: error.message });
        }
    }

    // 유저 아이디로 글 한개 조회(글이 존재하는가?)
    async selectPostByUserIdOnce(req: Request): Promise<Post | BadRequestException> {
        try {
            const token = req.cookies["token"];
            const { userId } = this.jwt.verify(token);
            return await this.postModel.findOne({ where: { userId } });
        } catch (error) {
            return new BadRequestException("post request fail service selectPostByUserIdOnce", { cause: error, description: error.message });
        }
    }

    // 마이페이지에서 해당 유저가 작성한 글 전체 가져오기
    async selectPostByUserId(req: Request): Promise<Post[] | BadRequestException | NotFoundException> {
        try {
            const token = req.cookies["token"];
            const { userId } = this.jwt.verify(token);

            const isExist = await this.selectPostByUserIdOnce(userId);
            if (!isExist) {
                return new NotFoundException("post not exist");
            }

            // 혹시 마이페이지에서 유저정보나 좋아요 필요할 시 include 추가해야 함
            return await this.postModel.findAll({ where: { userId } });
        } catch (error) {
            return new BadRequestException("post request fail service selectPostByUserId", { cause: error, description: error.message });
        }
    }

    // 검색어로 한개 조회
    async selectPostBySearchTarget(searchTarget: string): Promise<Post | BadRequestException> {
        try {
            return await this.postModel.findOne({ where: { title: { [Op.like]: `%${searchTarget}%` } } });
        } catch (error) {
            return new BadRequestException("post request fail service selectPostBySearchTarget", { cause: error, description: error.message });
        }
    }

    // 검색어로 10개 조회
    async selectPostBySearchTargetLimitTen(searchTarget: string): Promise<Post[] | BadRequestException> {
        try {

            const isExist = await this.selectPostBySearchTarget(searchTarget);
            if (!isExist) {
                return new NotFoundException("검색결과 없음");
            }

            const data = await this.postModel.findAll({ where: { title: { [Op.like]: `%${searchTarget}%` } }, limit: 10, include: [User, PostLikes] });
            return this.likeDislikeCalcForPostArr(data);
        } catch (error) {
            return new BadRequestException("post request fail service selectPostBySearchTargetLimitTen", { cause: error, description: error.message });
        }
    }


    // 수정
    async updatePostById(id: number, req: Request, updatePost: CreatePost): Promise<[affectedCount: number] | UnauthorizedException | BadRequestException> {
        try {
            // 작성자와 jwt토큰의 유저 정보가 일치하는지 확인해야함(서비스로직? or pipe?)
            const token = req.cookies["token"];
            const { userId } = this.jwt.verify(token);

            const data = await this.selectPostById(id);
            if (data["dataValues"].user.dataValues.id !== userId) {
                return new UnauthorizedException("작성자와 로그인된 유저 불일치");
            }

            const { title, content, imgPath } = updatePost;

            // 이미지 없이 요청 시 에러발생 혹은 if문을 안타서 이미지 파일이 삭제될 가능성 있음 확인하기
            if (!imgPath) {
                return await this.postModel.update({ title, content }, { where: { id } });
            }

            // 수정시 수정전 이미지 삭제
            fs.rm(`src/static${data["dataValues"]["imgPath"]}`, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            return await this.postModel.update({ title, content, imgPath }, { where: { id } });
        } catch (error) {
            return new BadRequestException("post request fail service updatePostById", { cause: error, description: error.message });
        }
    }

    // 삭제
    async deletePostById(id: number, req: Request): Promise<number | BadRequestException | UnauthorizedException> {
        try {
            const token = req.cookies["token"];
            const { userId } = this.jwt.verify(token);

            const data = await this.selectPostById(id);
            if (data["dataValues"].user.dataValues.id !== userId) {
                return new UnauthorizedException("작성자와 로그인된 유저 불일치");
            }

            // 삭제시 저장된 이미지도 삭제
            fs.rm(`src/static${data["dataValues"].imgPath}`, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            return await this.postModel.destroy({ where: { id } });
        } catch (error) {
            return new BadRequestException("post request fail service deletePostById", { cause: error, description: error.message });
        }
    }


}
