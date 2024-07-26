import { ArgumentMetadata, Injectable, PipeTransform, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JWTPipe implements PipeTransform {
    constructor(private readonly jwt: JwtService) {

    }
    transform(value: any, metadata: ArgumentMetadata) {
        const { token } = value.cookies;
        if (!token) new UnauthorizedException("토큰이 없음")
        const userInfo = this.jwt.verify(token);
        console.log(userInfo)
        value["user"] = userInfo;
        return value;
    }
}