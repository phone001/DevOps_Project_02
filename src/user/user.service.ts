import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './User.Repository';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository, private readonly jwt: JwtService) { }
  async create(userDTO: CreateUserDto, file: Express.Multer.File) {
    if (file) {
      userDTO.imgPath = "/imgs/user/" + file.filename;
    } else {
      userDTO.imgPath = "/imgs/user/default.png"
    }

    const data = await this.userRepo.findUser(userDTO.loginId, userDTO.oauthType);
    if (data) {
      console.log("이미 계정이 있음");
      return false;
    }
    userDTO.password = await hash(userDTO.password, 10);
    return await this.userRepo.createUser(userDTO);
  }

  async createSotial(userDTO: CreateUserDto, token: string) {
    let user = null;
    if (userDTO.oauthType == 'kakao') {
      const { data: { id, properties } } = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      user = {
        loginId: `${properties.nickname}_${id}`,
        password: id,
        nickname: userDTO.nickname == '' ? properties.username : userDTO.nickname,
        imgPath: userDTO["imgPath"] ? userDTO["imgPath"] : properties.profile_image,
        oauthType: userDTO.oauthType
      }
    } else {
      console.log(token)
      const { data: { email, name, id, picture } } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      user = {
        loginId: email,
        nickname: userDTO.nickname == '' ? name : userDTO.nickname,
        password: id,
        imgPath: userDTO["imgPath"] ? picture : userDTO["imgPath"],
        oauthType: userDTO.oauthType
      }
    }

    const data = await this.userRepo.findUser(user.loginId, user.oauthType);
    console.log(data)
    if (data) {
      console.log("이미 계정이 있음");
      return false;
    }
    //user.password = await hash(user.password, 10);
    return await this.userRepo.createUser(user);
  }

  async signIn(loginId: string, password: string, oauthType: string, accessToken: string) {
    console.log(loginId)
    const data = await this.userRepo.findUser(loginId, oauthType);
    if (!data) return
    let token = null;
    if (oauthType == "email" && await compare(password, data.password)) {
      token = this.jwt.sign({
        userId: data.id,
        loginId,
        oauthType
      })
    } else if (oauthType != "email") {
      token = this.jwt.sign({
        userId: data.id,
        loginId,
        oauthType,
        accessToken
      })
    }
    return token;

  }

  async logout(token: string): Promise<string> {
    try {

      const userInfo = this.jwt.verify(token);

      if (userInfo["accessToken"]) {
        const url = userInfo["oauthType"] == "kakao" ? "https://kapi.kakao.com/v1/user/logout" : "https://accounts.google.com/Logout";
        const id = userInfo["accessToken"] == "kakao" ? userInfo.loginId.split("_")[1] : '';
        const result = await axios.post(url, {}, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${userInfo["accessToken"]}`
          }
        })
        console.log(result)
        return result.data;
      }
    } catch (error) {
      console.error(error);
    }
    return;
  }
}
