import { Controller } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';

@Controller('post-likes')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}
}
