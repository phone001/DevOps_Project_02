import { Strategy, Profile } from 'passport-kakao';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { ConfigService } from "@nestjs/config";
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(private readonly config: ConfigService) {
        super({
            clientID: config.get<string>("KAKAO_API_KEY"),
            callbackURL: "http://localhost:3000/auth/kakao/callback",
        });

    }
    async validate(accessToken: string, refrashToken: string, profile: Profile, done: Function): Promise<any> {
        try {
            const { id, username, _json, provider } = profile;
            const user = {
                loginId: `${username}_${id}`,
                username,
                oauthType: provider,
                imgPath: _json.properties.profile_image,
                accessToken
            }
            done(null, user);
            return user;
        } catch (error) {
            console.log(error)
        }
    }
}