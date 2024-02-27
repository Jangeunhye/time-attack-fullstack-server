import { UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export default function authGuard(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  if (!req.user) throw new UnauthorizedException('Unauthorized');

  next();
}
