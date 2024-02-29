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
    const { id } = req.params;
    const record: T | null = await this.service.findOne({ where: {id} });
    if (!record) throw new NotFoundException(`Record with id ${id} was not found`);
    res.json(serialize(this.DtoClass, record));
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const recordList = await this.service.findAll({ limit: 20, nextId: '' });
    res.json(serialize(this.DtoClass, recordList));
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const record = await this.service.create(data);
    res.json(serialize(this.DtoClass, record));
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data = req.body;
    const record = await this.service.update(id, data);
    res.json(serialize(this.DtoClass, record));
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const record = await this.service.delete(id);
    res.json(serialize(this.DtoClass, record));
  }
}
