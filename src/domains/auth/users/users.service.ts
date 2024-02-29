import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/db/prisma/prisma.service';
import generateRandomId from 'src/utils/generateRandomId';
import { isEmail } from 'validator';
import { UserLogInDto, UserSignUpDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(dto: UserSignUpDto) {
    const { email, password } = dto;
    if (!email.trim()) throw new BadRequestException('No email');
    if (!isEmail(email)) throw new BadRequestException('Invalid email');
    if (!password.trim()) throw new BadRequestException('No password');
    if (password.length < 8)
      throw new BadRequestException('Too short password');

    const encryptedPassword = await hash(password, 12);

    const data: Prisma.UserCreateInput = {
      id: generateRandomId(),
      email,
      encryptedPassword,
    };

    const user = await this.prismaService.user.create({
      data,
    });
    const accessToken = this.generateAccessToken(user);
    return accessToken;
  }

  async logIn(dto: UserLogInDto) {
    const { email, password } = dto;
    if (!email.trim()) throw new BadRequestException('No email');
    if (!isEmail(email)) throw new BadRequestException('Invalid email');
    if (!password.trim()) throw new BadRequestException('No password');
    if (password.length < 4)
      throw new BadRequestException('Too short password');

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('No user');

    const isCorrectPassword = await compare(password, user.encryptedPassword);
    if (!isCorrectPassword) throw new BadRequestException('Invalid password');

    const accessToken = this.generateAccessToken(user);
    return accessToken;
  }

  async checkLoggedIn(user: User, dealId: number) {
    const verifiedUser = await this.prismaService.deal.findUnique({
      where: { userId: user.id, id: dealId },
    });
    return verifiedUser;
  }

  generateAccessToken(user: Pick<User, 'id' | 'email'>) {
    const JWT_SECRET_KEY = this.configService.getOrThrow('JWT_SECRET_KEY');
    const accessToken = sign({ email: user.email }, JWT_SECRET_KEY, {
      subject: String(user.id),
      expiresIn: '30m',
    });
    return accessToken;
  }

  async refreshToken(user: User) {
    const refreshedAccessToken = this.generateAccessToken(user);
    return refreshedAccessToken;
  }
}
