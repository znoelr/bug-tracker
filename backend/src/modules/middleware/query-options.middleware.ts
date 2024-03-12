
import { Request, Response, NextFunction } from "express";
import { QueryOptions } from "../common/fetch-objects";
import { catchAsync } from "../common/exception-handlers";
import { ClassConstructor, GenericObject, SortObject } from "../common/types";
import { createSortByObject, getValidSortKeys } from "../common/helpers";

export const injectQueryOptions = (queryOptions?: QueryOptions) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!queryOptions) {
      queryOptions = new QueryOptions();
    }
    req.queryOptions = queryOptions;
    next();
  })
;

export const parseUrlQueryForQueryOptionsSortBy = (classDto: ClassConstructor) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const sortQuery = (req.query?.sort || '-createdAt').toString();
    const validSortKeys: GenericObject<boolean> = getValidSortKeys(classDto);
    const sortBy: SortObject = createSortByObject(sortQuery, validSortKeys);
    req.queryOptions = req.queryOptions || new QueryOptions();
    req.queryOptions.setSortBy(sortBy);
    next();
  })
;
