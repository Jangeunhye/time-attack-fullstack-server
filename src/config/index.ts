import { BadRequestException } from '@nestjs/common';
import dotenv from 'dotenv';
dotenv.config();

export const PASSWORD_SALT_ROUNDS = 12;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

if (!JWT_SECRET_KEY) throw new BadRequestException('No JWT_SECRET_KEY');
