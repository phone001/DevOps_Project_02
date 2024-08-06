import { Res, Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Inject, Req, UploadedFile, Query, UsePipes, Headers, HttpStatus, UseGuards, Put, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request, query } from "express";
import { JsonWebTokenError } from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenEmptyGuard, TokenExistGuard } from 'src/auth/guards/token.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags("User")
@Controller('user')
export class UserController {
  constructor(private readonly jwt: JwtService, private readonly userService: UserService, private readonly configService: ConfigService) { }

  @Post("createUser")
  @ApiOperation({ summary: "회원가입" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        loginId: { type: "string" },
        password: { type: "string" },
        oauthType: { type: "string" },
        nickname: { type: "string" },
        file: { type: "string", format: "binary" }
      }
    }
  })
  @UseGuards(TokenExistGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() userInfo: CreateUserDto, @Req() req: Request, @Query("token") token: string) {
    let data = null;
    if (token) {
      data = await this.userService.createSotial(userInfo, token);
      return data;
    }
    data = await this.userService.create(userInfo, file);
    return data;
  }

  @Post('signin')
  @ApiOperation({ summary: "로그인" })
  @ApiBody({
    schema: {
      properties: {
        loginId: { type: "string" },
        password: { type: "string" },
        oauthType: { type: "string" },
      }
    }
  })
  @UseGuards(TokenExistGuard)
  async signIn(@Body('loginId') id: string, @Body("password") password: string, @Body("oauthType") oauthType: string, @Res() res: Response) {
    const token = await this.userService.signIn(id, password, oauthType, null);
    if (token) {

      const date = new Date();
      date.setHours(date.getHours() + 1);
      const NODE_ENV = this.configService.getOrThrow('NODE_ENV')
      console.log(NODE_ENV)
      if (NODE_ENV === 'production') {
        res.cookie("token", token, { httpOnly: true, expires: date, sameSite: "none", secure: true, path: "/", domain: "testcoffeetree.store" });
      } else {
        res.cookie('token', token, { path: "/" })
      }

      // res.redirect("https://dropdot.shop");
      res.status(200).send({ token });
    } else {
      res.status(400).send();
    }
  }

  @Post("logout")
  @UseGuards(TokenEmptyGuard)
  @ApiOperation({ summary: "로그아웃" })
  async logout(@Req() req: Request, @Res() res: Response) {
    const { token } = req.cookies;
    const result = await this.userService.logout(token);
    res.clearCookie('token');
    res.status(HttpStatus.OK);
    res.send(result);
  }

  @Post('getUserInfo')
  @UseGuards(TokenEmptyGuard)
  @ApiOperation({ summary: "getUserInfo" })
  async myPage(@Req() req: Request, @Res() res: Response) {
    const { token } = req.cookies || req.headers.authorization;

    if (!token) {

      return res.status(400).send();
    }
    const info = await this.userService.userInfo(token);
    return res.send({ info });
  }

  @Put("modify")
  @ApiBody({
    schema: {
      properties: {
        nickname: { type: "string" },
        password: { type: "string" },
      }
    }
  })
  @ApiOperation({ summary: "회원정보 수정" })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(TokenEmptyGuard)
  async modify(@Req() req: Request, @UploadedFile() file: Express.Multer.File,) {
    try {
      const info = req.body;
      const data = await this.userService.modify(file, info);
      return data;
    } catch (error) {
      console.log(error)
    }
  }

  @Delete("delete")
  @UseGuards(TokenEmptyGuard)
  @ApiOperation({ summary: "회원 탈퇴" })
  async deleteUser(@Body("id", ParseIntPipe) id: number, @Res() res: Response) {
    res.clearCookie('token');
    res.status(HttpStatus.OK);
    await this.userService.delete(id);
    res.send();
  }
}
