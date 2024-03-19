import { plainToInstance } from "class-transformer";
import { ClassConstructor, GenericObject, SortDirection } from "../types";

export const getValidSortKeys = (classDto: ClassConstructor) => {
  const instance = plainToInstance(classDto, {});
  return Object.keys(instance).reduce((acc: any, key: string) => {
    acc[key] = true;
    return acc;
  }, {});
};

export const createSortByObject = (sortQuery: string, validSortKeys: GenericObject<boolean>) => {
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

export const createSelectObject = (selectQuery: string, validSortKeys: GenericObject<boolean>) => {
  return selectQuery.split(',').reduce((acc: any, key: string) => {
    if (validSortKeys[key]) {
      acc[key] = true;
    }
    return acc;
  }, {});
};
