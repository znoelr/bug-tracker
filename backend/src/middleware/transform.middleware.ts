import { NextFunction, Request, Response } from "express";
import { GenericFunction } from "../common/types";
import { catchAsync } from "../common/exception-handlers";

export const transformRequestBody = (...cbArr: GenericFunction[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    for (const cb of cbArr) {
      req.body = await cb(req.body);
    }
    next();
  })
;