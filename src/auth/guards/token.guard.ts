import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from 'rxjs';
import { Auth } from "src/user/auth/auth";
@Injectable()
export class TokenEmptyGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        //const token = Auth.getToken(context.switchToHttp().getRequest());
        const { token } = context.switchToHttp().getRequest().cookies;
        console.log(context.switchToHttp().getRequest().headers);
        console.log(context.switchToHttp().getRequest().cookies);

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
        const token = Auth.getToken(context.switchToHttp().getRequest());
        console.log("token", token)
        console.log(typeof token);
        if (token)
            throw new UnauthorizedException("로그인 정보가 있어서 안됨");

        return true;
    }
}