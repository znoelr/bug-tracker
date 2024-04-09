import { NextFunction, Request, Response } from "express";
import { CreateMergedKeys } from "../common/types";
import { objectReducerForKeys } from "../common/reducers";
import { catchAsync } from "../common/exception-handlers";

export const createRequestBodyFromParams = (keys: string[]) =>
  catchAsync((req: Request, res: Response, next: NextFunction) => {
    req.body = keys.reduce(objectReducerForKeys(req.params), {});
    next();
  })
;

export const createRequestBodyForKeys = ({ paramKeys = [], bodyKeys = [] }: CreateMergedKeys) =>
  catchAsync((req: Request, res: Response, next: NextFunction) => {
    req.body = {
      ...paramKeys.reduce(objectReducerForKeys(req.params), {}),
      ...bodyKeys.reduce(objectReducerForKeys(req.body), {}),
    };
    next();
  })
;

export const extendRequestBodyForKeys = ({ paramKeys = [], bodyKeys = [] }: CreateMergedKeys) =>
  catchAsync((req: Request, res: Response, next: NextFunction) => {
    req.body = {
      ...req.body,
      ...paramKeys.reduce(objectReducerForKeys(req.params), {}),
      ...bodyKeys.reduce(objectReducerForKeys(req.body), {}),
    };
    next();
  })
;
