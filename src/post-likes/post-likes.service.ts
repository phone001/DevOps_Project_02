import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostLikes } from './entities/postLikes.entity';

@Injectable()
export class PostLikesService {
    constructor(
        @InjectModel(PostLikes)
        private readonly postLikeModel: typeof PostLikes
    ) { }


}
