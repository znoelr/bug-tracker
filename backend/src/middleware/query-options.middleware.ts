
import { Request, Response, NextFunction } from "express";
import { QueryOptions, QueryOptionsTransformerCb } from "../common/types";
import { catchAsync } from "../common/exception-handlers";
import { ClassConstructor, GenericObject, SortObject } from "../common/types";
import { createSelectObject, createSortByObject, getValidSortKeys } from "../common/helpers";

export const injectQueryOptions = (fn: () => QueryOptions) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.queryOptions = await fn();
    next();
  })
;

export const injectTransformedQueryOptions = (cb: QueryOptionsTransformerCb) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.queryOptions = cb(req.queryOptions || new QueryOptions());
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

export const parseUrlQueryForQueryOptionsSelect = (classDto: ClassConstructor) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const sortQuery = (req.query?.select || '').toString();
    const validSortKeys: GenericObject<boolean> = getValidSortKeys(classDto);
    const select: SortObject = createSelectObject(sortQuery, validSortKeys);
    req.queryOptions = req.queryOptions || new QueryOptions();
    req.queryOptions.setSelect(select);
    next();
  })
;
