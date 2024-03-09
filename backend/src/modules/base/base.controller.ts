import { NextFunction, Request, Response } from "express";
import { BaseService } from "./base.service";
import { NotFoundException } from "../common/exceptions";
import { serialize } from "../common/serializers";

export class BaseController<T> {
  constructor(
    protected readonly DtoClass: {new(): T},
    protected readonly service: BaseService<T>
  ) {}

  async findById(req: Request, res: Response, next: NextFunction) {
    const filters = req.queryFilters;
    const options = req.queryOptions;
    const record: T | null = await this.service.findOne(filters, options);
    if (!record) throw new NotFoundException('Resource Not found');
    res.json(serialize(this.DtoClass, record));
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const pagination = req.pagination;
    const filters = req.queryFilters;
    const options = req.queryOptions;
    const recordList = await this.service.findAll(pagination, filters, options);
    res.json(serialize(this.DtoClass, recordList));
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const options = req.queryOptions;
    const record = await this.service.create(data, options);
    res.status(201).json(serialize(this.DtoClass, record));
  }

  async createForLinking(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const options = req.queryOptions;
    const record = await this.service.create(data, options);
    req.body = serialize(this.DtoClass, record);
    next();
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const filters = req.queryFilters;
    const options = req.queryOptions;
    const record = await this.service.update(data, filters, options);
    res.json(serialize(this.DtoClass, record));
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const filters = req.queryFilters;
    const options = req.queryOptions;
    await this.service.delete(filters, options);
    res.sendStatus(204);
  }

  async deleteLinked(req: Request, res: Response, next: NextFunction) {
    const filters = req.queryFilters;
    const options = req.queryOptions;
    await this.service.delete(filters, options);
    next();
  }
}
