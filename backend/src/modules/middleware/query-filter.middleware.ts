import { Request, Response, NextFunction } from "express";
import { QueryFilters } from "../common/fetch-objects";
import { GenericFunction } from "../common/types";

export const parseParamsForQueryFilter = () =>
  async (req: Request, res: Response, next: NextFunction) => {
    const reqParams = req.params || {};
    req.queryFilters = new QueryFilters()
      .setWhere(reqParams);
    next();
  }
;

export const injectParamsForQueryFilter = (cb: GenericFunction) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const params = cb(req.params);
    req.queryFilters = (req.queryFilters || new QueryFilters())
      .setWhere(params);
    next();
  }
;
