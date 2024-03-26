import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../common/exception-handlers";

export const injectCreatedBy = catchAsync((req: Request, res: Response, next: NextFunction) => {
  req.body = {
    ...req.body,
    createdById: req.user.id,
  }
  next();
});
