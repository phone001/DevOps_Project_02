import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class logIntercepter implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        const date = new Date();
        const req = context.switchToHttp().getRequest();
        const log = `${req.originalUrl} ${date.toLocaleString()}`;

        return next.handle().pipe(
            tap(() => {
                const date2 = new Date();
                const time = date2.getTime() - date.getTime() + "ms";
                console.log(log, time);
            })
        )
    }
}