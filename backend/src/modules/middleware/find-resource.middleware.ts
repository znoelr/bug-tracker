import { NextFunction, Request, Response } from "express";
import { BaseService } from "../base/base.service";
import { BadRequestException, NotFoundException } from "../common/exceptions";
import { FindResourceError } from "../common/types";

export const returnResponseError = <T>(service: BaseService<T>, {throwWhenFound, error}: FindResourceError) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { queryFilters } = req;
    const record = await service.findOne(queryFilters);
    if (
      (throwWhenFound && record) ||
      (!throwWhenFound && !record)
    ) {
      next(error);
      return;
    }
    next();
  }
;

export const findResourceByRequestQueryFilters = <T>(service: BaseService<T>) =>
  returnResponseError<T>(service, {
    throwWhenFound: false,
    error: new NotFoundException('Resource Not found'),
  })
;

export const throwBadRequestIfResourceExistByQueryFilters = <T>(service: BaseService<T>, msg?: string) =>
  returnResponseError<T>(service, {
    throwWhenFound: true,
    error: new BadRequestException(msg || 'Resource already exists'),
  })
;
