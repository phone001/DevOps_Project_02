import { Req, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get("kakao")
  @UseGuards(AuthGuard('kakao'))
  kakaoAuth(@Req() req: Request) {
  }


  @Get("kakao/callback")
  @UseGuards(AuthGuard("kakao"))
  async kakaoAuthCallback(@Query("code") code: string, @Req() req: Request, @Res() res: Response) {
    // 로그인
    // 회원 정보가 없으면 회원 가입 페이지로 리다이렉트
    // 있으면 토큰 까서 정보로 새로 토큰 발급
    const data = req.user;

    const token = await this.authService.validateUser(data["loginId"], data["oauthType"], data["accessToken"]);
    if (!token) {
      res.setHeader("content-type", "text/html")
      return res.send(`<script>alert('회원가입페이지로 이동합니다.');opener.location.href='http://localhost:8000/user/signup?token=${data['accessToken']}&oauthType=kakao'; window.close(); </script>`)
    }
    const date = new Date();
    date.setMinutes(date.getMinutes() + 60);

    res.cookie("token", token, { httpOnly: true, expires: date, sameSite: 'none' });
    res.setHeader("content-type", "text/html")
    return res.send(`<script>opener.location.href='http://localhost:8000/user/signin'; window.close(); </script>`)
  }



  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth(@Req() req: Request) {

  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Query("code") code: string, @Req() req: Request, @Res() res: Response) {
    try {
      const data = req.user;
      const token = await this.authService.validateUser(data["loginId"], data["oauthType"], data["accessToken"]);

      if (!token) {
        res.setHeader("content-type", "text/html")
        return res.send(`<script>alert('회원가입으로 이동합니다.');opener.location.href='http://localhost:8000/user/signup?token=${data["accessToken"]}&oauthType=google'; window.close(); </script>`)
      }
      const date = new Date();
      date.setMinutes(date.getMinutes() + 60);

      res.cookie("token", token, { httpOnly: true, expires: date, sameSite: 'none' });
      res.setHeader("content-type", "text/html")
      return res.send(`<script>opener.location.href='http://localhost:8000'; window.close(); </script>`)
    } catch (error) {
      console.log(error)
    }
  }

}
