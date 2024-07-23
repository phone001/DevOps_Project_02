import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class PostIdIsNumber implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const postId = parseInt(value);
        if (typeof postId !== "number") {
            throw new BadRequestException("post request fail pipe PostIdIsNumber");
        }
        return postId;
    }
}