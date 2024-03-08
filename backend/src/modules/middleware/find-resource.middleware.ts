import { NextFunction, Request, Response } from "express";
import { BaseService } from "../base/base.service";
import { NotFoundException } from "../common/exceptions";

export const findResourceByRequestQueryFilters = (service: BaseService<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { queryFilters } = req;
    const record = await service.findOne(queryFilters);
    if (!record) {
      next(new NotFoundException('Resource Not found'));
      return;
    }
    next();
  }
;
