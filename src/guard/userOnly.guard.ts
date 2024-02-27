import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class UserOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userOnly = this.reflector.get<boolean>(
      'UserOnly',
      context.getHandler(),
    );
    if (!userOnly) return true;

    const request = context.switchToHttp().getRequest<Request>();
    if (!request.user) throw new ForbiddenException();

    return true;
  }
}
