import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from 'rxjs';

class TokenGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const { cookies: { token } } = context.switchToHttp().getRequest();
        if (!token)
            throw new UnauthorizedException("로그인하고 와");
        const result = this.jwt.verify(token);
        if (!result)
            throw new UnauthorizedException("토큰이 상했어");
        return true;
    }
}