
import { Request, Response, NextFunction } from "express";
import { QueryOptions } from "../common/fetch-objects";
import { catchAsync } from "../common/exception-handlers";
import { ClassConstructor, GenericObject, SortObject, SortDirection } from "../common/types";
import { plainToInstance } from "class-transformer";

export const injectQueryOptions = (queryOptions?: QueryOptions) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!queryOptions) {
      queryOptions = new QueryOptions();
    }
    req.queryOptions = queryOptions;
    next();
  })
;

const getValidKeysSort = (classDto: ClassConstructor) => {
  const instance = plainToInstance(classDto, {});
  return Object.keys(instance).reduce((acc: any, key: string) => {
    acc[key] = true;
    return acc;
  }, {});
};

const createsortByObject = (sortQuery: string, validSortKeys: GenericObject<boolean>) => {
  return sortQuery.split(',').reduce((acc: any, key: string) => {
    let sortDirection: SortDirection = 'asc';
    const sortDesc = key.startsWith('-');
    if (sortDesc) {
      key = key.slice(1);
      sortDirection = 'desc';
    }
    if (validSortKeys[key]) {
      acc[key] = sortDirection;
    }
    return acc;
  }, {});
};

export const parseUrlQueryForQueryOptionsSortBy = (classDto: ClassConstructor) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const sortQuery = (req.query?.sort || '-createdAt').toString();
    const validSortKeys: GenericObject<boolean> = getValidKeysSort(classDto);
    const sortBy: SortObject = createsortByObject(sortQuery, validSortKeys);
    req.queryOptions = req.queryOptions || new QueryOptions();
    req.queryOptions.setSortBy(sortBy);
    next();
  })
;
