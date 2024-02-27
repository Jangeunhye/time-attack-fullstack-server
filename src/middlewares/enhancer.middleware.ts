import { NextFunction, Request, Response } from 'express';

export default async function enhancerMiddleware(
  _: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.sendJson = <T>(data: T) => {
      const response = {
        success: true,
        result: data === undefined ? null : data,
        error: null,
      };
      res.json(response);
    };

    next();
  } catch (e) {
    next(e);
  }
}
