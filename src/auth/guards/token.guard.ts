import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from 'rxjs';
@Injectable()
export class TokenEmptyGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const { cookies: { token } } = context.switchToHttp().getRequest();
        const { cookies } = context.switchToHttp().getRequest();
        console.log(context.switchToHttp().getRequest().headers);
        if (!token)
            throw new UnauthorizedException("로그인하고 와");
        const result = this.jwt.verify(token)
        if (!result)
            throw new UnauthorizedException("토큰이 상했어");
        return true;
    }
}

export class TokenExistGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const { cookies: { token } } = context.switchToHttp().getRequest();
        if (token)
            throw new UnauthorizedException("로그인 정보가 있어서 안됨");

        return true;
    }
}