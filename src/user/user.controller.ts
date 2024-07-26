import { Res, Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Inject, Req, UploadedFile, Query, UsePipes, Headers, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request, query } from "express";
import { JsonWebTokenError } from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { JWTPipe } from 'src/pipe/JWT.pipe';
import { ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("User")
@Controller('user')
export class UserController {
  constructor(private readonly jwt: JwtService, private readonly userService: UserService) { }

  @Post("createUser")
  @ApiOperation({ summary: "회원가입" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      properties: {
        loginId: { type: "string" },
        password: { type: "string" },
        oauthType: { type: "string" },
        nickname: { type: "string" },
        file: { type: "string", format: "binary" }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() userInfo: CreateUserDto, @Req() req: Request, @Query("token") token: string) {
    let data = null;
    console.log(userInfo)
    if (token) {
      data = await this.userService.createSotial(userInfo, token);
      console.log()
      return data;
    }

    data = await this.userService.create(userInfo, file);
    console.log("데이터", data);
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
  async signIn(@Body('loginId') id: string, @Body("password") password: string, @Body("oauthType") oauthType: string, @Res() res: Response) {
    const token = await this.userService.signIn(id, password, oauthType, null);
    if (token) {
      const date = new Date();
      date.setMinutes(date.getMinutes() + 60);
      res.cookie("token", token, { httpOnly: true, expires: date });
      console.log(res)
      return res.redirect("http://localhost:8000");
    } else {
      res.setHeader("content-type", "text/html");
      res.send("<script>alert('계정을 다시 확인해주세요');location.href='http://localhost:8000/user/signin'</script>")
    }
  }

  @Post("logout")
  @ApiOperation({ summary: "로그아웃" })
  @ApiHeader({
    s
  })
  async logout(@Req() req: Request, @Res() res: Response) {
    const { token } = req.cookies;
    console.log(token)
    const result = await this.userService.logout(token);
    res.clearCookie('token');
    res.status(HttpStatus.OK);
    res.send(result);
  }
}
