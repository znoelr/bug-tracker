import { NextFunction, Request, Response } from "express";
import { CreateMergedKeys } from "../common/types";
import { objectReducerForKeys } from "../common/reducers";

export const createRequestBodyFromParams = (keys: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = keys.reduce(objectReducerForKeys(req.params), {});
    next();
  }
;

export const createRequestBodyForKeys = ({ paramKeys, bodyKeys }: CreateMergedKeys) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = {
      ...paramKeys.reduce(objectReducerForKeys(req.params), {}),
      ...bodyKeys.reduce(objectReducerForKeys(req.body), {}),
    };
    next();
  }
;
