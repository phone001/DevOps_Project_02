export interface IAuthStrategy {
    token_url: string;
    userInfo_url: string;
    validate(code: string): Promise<any>;
}