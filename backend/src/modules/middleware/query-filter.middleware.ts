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

export const injectQueryFiltersfromRequestKey = (key: keyof Request) => (cb: GenericFunction) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const where = cb(req[key]);
    req.queryFilters = (req.queryFilters || new QueryFilters())
      .setWhere(where);
    next();
  }
;

export const injectQueryFiltersfromParams = injectQueryFiltersfromRequestKey('params');

export const injectQueryFiltersfromBody = injectQueryFiltersfromRequestKey('body');
