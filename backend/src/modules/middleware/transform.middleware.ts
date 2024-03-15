import { NextFunction, Request, Response } from "express";
import { GenericFunction } from "../common/types";
import { catchAsync } from "../common/exception-handlers";

export const transformRequestBody = (cb: GenericFunction) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.body = await cb(req.body);
    next();
  })
;