import { NextFunction, Request, Response } from "express";
import { BaseService } from "./base.service";
import { NotFoundException } from "../common/exceptions";
import { serialize } from "../common/serializers";
import { RequesOptions } from "../common/types";

export class BaseController<T> {
  constructor(
    protected readonly DtoClass: {new(): T},
    protected readonly service: BaseService<T>
  ) {}

  async findById(reqOptions: RequesOptions, req: Request, res: Response, next: NextFunction) {
    const filters = req.queryFilters;
    const options = req.queryOptions;
    const record: T | null = await this.service.findOne(filters, options);
    if (!record) throw new NotFoundException('Resource Not found');
    if (reqOptions.endRequest) {
      res.json(serialize(this.DtoClass, record));
      return;
    }
    next();
  }

  async findAll(reqOptions: RequesOptions, req: Request, res: Response, next: NextFunction) {
    const filters = req.queryFilters;
    const options = req.queryOptions;
    const pagination = req.pagination;
    const recordList = await this.service.findAll(filters, options, pagination);
    if (reqOptions.endRequest) {
      res.json(serialize(this.DtoClass, recordList));
      return;
    }
    next();
  }

  async create(reqOptions: RequesOptions, req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const options = req.queryOptions;
    const record = await this.service.create(data, options);
    if (reqOptions.endRequest) {
      res.status(201).json(serialize(this.DtoClass, record));
      return;
    }
    req.body = serialize(this.DtoClass, record);
    next();
  }

  async update(reqOptions: RequesOptions, req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const filters = req.queryFilters;
    const options = req.queryOptions;
    const record = await this.service.update(data, filters, options);
    if (reqOptions.endRequest) {
      res.json(serialize(this.DtoClass, record));
      return;
    }
    req.body = serialize(this.DtoClass, record);
    next();
  }

  async delete(reqOptions: RequesOptions, req: Request, res: Response, next: NextFunction) {
    const filters = req.queryFilters;
    const options = req.queryOptions;
    await this.service.delete(filters, options);
    if (reqOptions.endRequest) {
      res.sendStatus(204);
      return;
    }
    next();
  }
}
