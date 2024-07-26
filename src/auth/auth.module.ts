import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KakaoStrategy } from 'src/strategy/kakao.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/strategy/google.strategy';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/User.Repository';
import { UserModel } from 'src/user/User.Model';
import { UserController } from 'src/user/user.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, GoogleStrategy],
})
export class AuthModule { }
