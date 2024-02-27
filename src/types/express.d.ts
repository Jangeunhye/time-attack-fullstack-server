import { User } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      accessToken?: string;
      user: User;
    }

    export interface Response {
      sendJson: <T>(data?: T) => void;
    }
  }
}
