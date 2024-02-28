import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserLogInDto, UserSignUpDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async signUp(@Body() dto: UserSignUpDto, @Req() response: Response) {
    const accessToken = await this.usersService.signUp(dto);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    });
    response.sendJson(accessToken);
  }

  @Post('log-in')
  async logIn(
    @Body() dto: UserLogInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.usersService.logIn(dto);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    });
    response.sendJson(accessToken);
  }

  @Delete('log-out')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
    });
  }

  @Get('refresh-token')
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const user = request.user;
    if (!user) {
      response.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
      });
      response.sendJson(false);
      return;
    }

    const accessToken = this.usersService.generateAccessToken(user);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    });
    response.sendJson(true);
  }
}
