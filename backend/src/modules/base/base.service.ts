import { BaseRepo } from "./base.repo";
import { NotFoundException } from "../common/exceptions";
import { Pagination, QueryFilters, QueryOptions } from "../common/types";

export abstract class BaseService<T> {
  constructor(protected readonly repo: BaseRepo<T>) {}

  async findById(id: string) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Record with id ${id} was not found`);
    return record;
  }

  async findAll(pagination: Pagination, queryFilters?: QueryFilters, queryOptions?: QueryOptions) {
    return await this.repo.findAll(pagination, queryFilters, queryOptions);
  }
}
