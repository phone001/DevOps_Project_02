export class Auth {
    static getToken(req: any): string {
        const token = req.cookies.token || req.headers.authorization.replace("Bearer ", "");
        return token;
    }
}