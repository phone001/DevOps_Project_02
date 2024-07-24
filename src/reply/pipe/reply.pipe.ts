import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ReplyIdIsNumber implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const replyId = parseInt(value);
        if (typeof replyId !== "number") {
            throw new BadRequestException("reply request fail pipe ReplyIdIsNumber");
        }
        return replyId;
    }
}

export class CommentIdIsNumber implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const CommentId = parseInt(value);
        if (typeof CommentId !== "number") {
            throw new BadRequestException("reply request fail pipe CommentIdIsNumber");
        }
        return CommentId;
    }
}