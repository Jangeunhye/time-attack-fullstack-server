import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { DUser } from 'src/decorator/user.decorator';
import { UserOnly } from 'src/decorator/useronly.decorator';
import { UserLogInDto, UserSignUpDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async signUp(@Body() dto: UserSignUpDto) {
    const accessToken = await this.usersService.signUp(dto);
    return accessToken;
  }

  @Post('log-in')
  async logIn(@Body() dto: UserLogInDto) {
    const accessToken = await this.usersService.logIn(dto);
    return accessToken;
  }

  @UserOnly()
  @Post('refresh-token')
  async refreshToken(@DUser() user: User) {
    const accessToken = await this.usersService.refreshToken(user);
    return accessToken;
  }

  @UserOnly()
  @Post('check-login/:dealId')
  async checkLoggedIn(
    @DUser() user: User,
    @Param('dealId', ParseIntPipe) dealId: number,
  ) {
    const verifiedUser = await this.usersService.checkLoggedIn(user, dealId);
    return verifiedUser;
  }
}
