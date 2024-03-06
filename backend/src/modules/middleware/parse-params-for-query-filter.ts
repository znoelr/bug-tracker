import { Request, Response, NextFunction } from "express";
import { QueryFilters } from "../common/fetch-objects";

export const parseParamsForQueryFilter = () => async (req: Request, res: Response, next: NextFunction) => {
  const reqParams = req.params || {};
  req.queryFilters = new QueryFilters()
    .setWhere(reqParams);
  next();
}
