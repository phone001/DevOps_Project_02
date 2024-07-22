import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';
import { CreatePost } from './dto/post.dto';
import { Op } from 'sequelize';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post)
        private readonly postModel: typeof Post
    ) { }

    createPost = async (createPost: CreatePost): Promise<Post> => {
        console.log("asd")
        const { userId, title, content, imgPath } = createPost
        return await this.postModel.create({ userId, title, content, imgPath });
    }

    selectPostById = async (id: number): Promise<Post> => {
        console.log(await this.postModel.findOne({ where: { id } }));
        return await this.postModel.findOne({ where: { id } });
    }

    selectPostByIdLimitTen = async (id: number): Promise<any> => {
        // console.log(await this.postModel.findAll({ where: { id: { [Op.gte]: id } }, limit: 10 }));
        return await this.postModel.findAll({ where: { id: { [Op.gte]: id } }, limit: 10 });
    }



}
