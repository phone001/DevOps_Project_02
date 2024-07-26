import { Inject, Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserModel {
    constructor(@InjectModel(User) private readonly user: typeof User) { }

    async create(userDTO: CreateUserDto): Promise<User> {



        return await this.user.create({
            loginId: userDTO.loginId,
            password: userDTO.password,
            nickname: userDTO.nickname,
            oauthType: userDTO.oauthType,
            imgPath: userDTO.imgPath
        })
    }

    findUser(loginId: string, oauthType: string): Promise<User> {
        return this.user.findOne({
            where: {
                loginId, oauthType
            }
        })
    }

    signIn(loginId: string, password: string): Promise<User> {
        return this.user.findOne({ where: { loginId, password } })
    }
}