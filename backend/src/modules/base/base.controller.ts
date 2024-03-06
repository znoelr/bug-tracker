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
    const { id } = filters.where;
    const record: T | null = await this.service.findOne(filters);
    if (!record) throw new NotFoundException(`Record with id ${id} was not found`);
    res.json(serialize(this.DtoClass, record));
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const pagination = req.pagination;
    const filters = req.queryFilters;
    const recordList = await this.service.findAll(pagination, filters);
    res.json(serialize(this.DtoClass, recordList));
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const record = await this.service.create(data);
    res.json(serialize(this.DtoClass, record));
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const filters = req.queryFilters;
    const { id } = filters.where;
    const data = req.body;
    const record = await this.service.update(id, data);
    res.json(serialize(this.DtoClass, record));
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const filters = req.queryFilters;
    const { id } = filters.where;
    const record = await this.service.delete(id);
    res.json(serialize(this.DtoClass, record));
  }
}
