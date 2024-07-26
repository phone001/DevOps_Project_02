
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET_KEY,
            callbackURL: "http://localhost:3000/auth/google/callback",
            scope: ["openid", "profile", "email"]
        })
    }
    validate(accessToken: string, refrashToken: string, profile: Profile, done: Function) {
        try {
            const { _json, id, displayName, provider } = profile;
            const user = {
                loginId: _json.email,
                password: id,
                nickname: displayName,
                oauthType: provider,
                imgpath: _json.picture,
                accessToken
            }
            done(null, user);
            return user;
        } catch (error) {
            console.log(error);
        }
    }
}