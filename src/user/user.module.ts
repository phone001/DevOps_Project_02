import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CreateUserDto } from './dto/create-user.dto';

@Module({
  controllers: [UserController],
  providers: [UserService, CreateUserDto],
})
export class UserModule { }
