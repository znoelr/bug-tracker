import { NextFunction, Request, Response } from "express";

export const createRequestBodyFromParams = (keys: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = keys.reduce((acc: any, key: string) => {
      acc[key] = req.params[key];
      return acc;
    }, {});
    next();
  }
;
