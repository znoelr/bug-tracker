
import { Request, Response, NextFunction } from "express";
import { QueryOptions } from "../common/fetch-objects";

export const appendQueryOptions = (queryOptions: QueryOptions) => async (req: Request, res: Response, next: NextFunction) => {
  req.queryOptions = queryOptions;
  next();
}
