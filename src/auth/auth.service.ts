import { Injectable, Param } from '@nestjs/common';
import { UserModel } from 'src/user/User.Model';
import { UserController } from 'src/user/user.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }
  async validateUser(loginId: string, oauthType: string, accessToken: string): Promise<any> {
    const token = await this.userService.signIn(loginId, null, oauthType, accessToken);
    return token;
  }

  async googleValidate(code: string) {

  }


}
