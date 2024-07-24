import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class PostIdIsNumber implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const postId = parseInt(value);
        if (typeof postId !== "number") {
            throw new BadRequestException("comment request fail pipe PostIdIsNumber");
        }
        return postId;
    }
}

export class CommentIdIsNumber implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const CommentId = parseInt(value);
        if (typeof CommentId !== "number") {
            throw new BadRequestException("comment request fail pipe CommentIdIsNumber");
        }
        return CommentId;
    }
}