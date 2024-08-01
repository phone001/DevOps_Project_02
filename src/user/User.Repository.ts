import { Injectable } from "@nestjs/common";
import { UserModel } from "./User.Model";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserRepository {
    constructor(private readonly userModel: UserModel) { }
    async createUser(userDTO: CreateUserDto) {
        return await this.userModel.create(userDTO);
    }

    async findUser(loginId: string, oauthType: string) {
        return await this.userModel.findUser(loginId, oauthType);
    }

    async signIn(loginId: string, password: string) {
        return await this.userModel.signIn(loginId, password);
    }

    async userInfo(userId: number) {
        return await this.userModel.userInfo(userId);
    }
    async modify(id: number, info: any) {
        try {
            await this.userModel.modify(id, info);
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id: number) {
        await this.userModel.delete(id);
    }
}