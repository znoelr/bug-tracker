import { NextFunction, Request, Response } from "express";
import { BaseService } from "../base/base.service";
import { QueryFilters } from "../common/fetch-objects";
import { BadRequestException } from "../common/exceptions";
import { GenericFunction } from "../common/types";

export const validateUniqueKeysFromRequest = <T>(requestKey: keyof Request) => (service: BaseService<T>, keys: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const objectToSearchFrom = req[requestKey];
    const uniqueKeysToValidate = keys.filter((key) => {
      const [keyName] = key.split(':');
      return !!objectToSearchFrom[keyName];
    });
    if (!uniqueKeysToValidate.length) {
      next();
      return;
    }
    try {
      for (const key of uniqueKeysToValidate) {
        const [keyName, mappedKeyName] = key.split(':');
        const keyToSearch = mappedKeyName || keyName;
        const filters = new QueryFilters().setWhere({ [keyToSearch]: objectToSearchFrom[keyName] });
        const record = await service.findOne(filters);
        if (record) {
          next(new BadRequestException(`The provided ${keyName} already exists`));
          return;
        }
      }
      next();      
    }
    catch (error) {
      next(error);
    }
  }
;

export const validateRequest = (requestKey: keyof Request) => (cb: GenericFunction) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      cb(req[requestKey]);
      next();
    } catch (error) {
      next(error);
    }
  }
;
