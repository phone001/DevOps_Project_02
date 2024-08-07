export class Auth {
    static getToken(req: any): string | undefined {
        console.log(req.cookies.token);
        const token = req.cookies.token || req.headers.authorization.replace("Bearer ", "");
        if (token == 'undefined') return undefined;
        return token;
    }
}