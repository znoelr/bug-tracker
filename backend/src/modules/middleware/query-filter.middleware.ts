import { Request, Response, NextFunction } from "express";
import { QueryFilters } from "../common/types";
import { GenericFunction } from "../common/types";
import { catchAsync } from "../common/exception-handlers";

export const parseParamsForQueryFilter = () =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const reqParams = req.params || {};
    req.queryFilters = new QueryFilters()
      .setWhere(reqParams);
    next();
  })
;

export const injectQueryFiltersfromRequest = (key: keyof Request) => (cb: GenericFunction) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const where = cb(req[key]);
    req.queryFilters = (req.queryFilters || new QueryFilters())
      .setWhere(where);
    next();
  })
;
