import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../common/exception-handlers";

export const endBySendJsonFromRequestBody = catchAsync((req: Request, res: Response, next: NextFunction) => {
  res.json(req.body);
});
