import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './User.Repository';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { rm } from 'fs/promises';
import { join } from 'path';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository, private readonly jwt: JwtService) { }
  async create(userDTO: CreateUserDto, file: Express.Multer.File) {
    if (file) {
      userDTO.imgPath = "http://localhost:3000/imgs/user/" + file.filename;
    } else {
      userDTO.imgPath = "http://localhost:3000/imgs/user/default.png"
    }

    const data = await this.userRepo.findUser(userDTO.loginId, userDTO.oauthType);
    if (data) {
      console.log("이미 계정이 있음");
      return false;
    }
    userDTO.password = await hash(userDTO.password, 10);
    await this.userRepo.createUser(userDTO);
    return true;
  }

  async createSotial(userDTO: CreateUserDto, token: string) {
    let user = null;
    if (userDTO.oauthType == 'kakao' && token) {
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
    } else if (userDTO.oauthType == 'google' && token) {

      const { data } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      console.log(data);
      const { data: { email, name, id, picture } } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      user = {
        loginId: email,
        nickname: userDTO.nickname == '' ? name : userDTO.nickname,
        password: id,
        imgPath: userDTO["imgPath"] ? userDTO["imgPath"] : picture,
        oauthType: userDTO.oauthType
      }
    }
    const data = await this.userRepo.findUser(user.loginId, user.oauthType);
    if (data) {
      console.log("이미 계정이 있음");
      return false;
    }
    //user.password = await hash(user.password, 10);
    return await this.userRepo.createUser(user);
  }

  async signIn(loginId: string, password: string, oauthType: string, accessToken: string) {
    const data = await this.userRepo.findUser(loginId, oauthType);
    if (!data) return;
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

      if (userInfo["accessToken"] && userInfo["oauthType"] == 'kakao') {
        const result = await axios.post("https://kapi.kakao.com/v1/user/logout", {}, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${userInfo["accessToken"]}`
          }
        })
        return result.data;
      }
    } catch (error) {
      console.error(error);
    }
    return;
  }

  async userInfo(token: string) {
    const { userId } = this.jwt.verify(token);
    const info = await this.userRepo.userInfo(userId);
    return info;
  }

  async modify(file: Express.Multer.File, info: any) {
    try {
      if (file) {
        try {
          if (info.preImg.indexOf("/imgs/user/default.png") == -1) {
            const filePath = join(__dirname, '..', '..', "static", String(info.preImg).replace("http://127.0.0.1:3000/", ""))
            await rm(filePath);
            console.log(`${filePath} 삭제됨`)
          }
        } catch (error) {
          console.error("삭제할 이미지 없음");
        }
        info.imgPath = "http://127.0.0.1:3000/imgs/user/" + file.filename;
      }

      if (info.password) info.password = await hash(info.password, 10);
      await this.userRepo.modify(parseInt(info.id), info);
    } catch (error) {
      console.error(error);
    }
  }

  async delete(id: number) {
    //이미지, 작성글, 댓글, 대댓글 삭제
    await this.userRepo.delete(id);

  }
}
