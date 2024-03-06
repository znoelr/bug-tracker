import { Request, Response, NextFunction } from "express";
import { Pagination } from "../common/fetch-objects";

export const parseSearchForPagination = () => (req: Request, res: Response, next: NextFunction) => {
  const { limit, nextId } = req.query || {};
  req.pagination = new Pagination()
    .setLimit(limit)
    .setNextId(nextId);
  next();
}
