import { Request, Response, NextFunction } from "express";
import { Pagination } from "../common/types";
import { catchAsync } from "../common/exception-handlers";

export const parseSearchForPagination = () =>
  catchAsync((req: Request, res: Response, next: NextFunction) => {
    const { limit, nextId } = req.query || {};
    req.pagination = new Pagination()
      .setLimit(limit)
      .setNextId(nextId);
    next();
  })
;