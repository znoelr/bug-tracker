import { BaseRepo } from "./base.repository";
import { Pagination, QueryFilters, QueryOptions } from "../common/types";

export class BaseService<T> {
  constructor(protected readonly repo: BaseRepo<T>) {}

  async findOne(filters: QueryFilters, queryOptions?: QueryOptions): Promise<T|null> {
    const record = await this.repo.findOne(filters, queryOptions);
    return record;
  }

  async findAll(pagination: Pagination, queryFilters?: QueryFilters, queryOptions?: QueryOptions): Promise<T[]> {
    return await this.repo.findAll(pagination, queryFilters, queryOptions);
  }

  async create(data: any): Promise<T> {
    return await this.repo.create(data);
  }

  async update(id: string, data: any): Promise<T> {
    return await this.repo.update(id, data);
  }

  async delete(id: string): Promise<T> {
    return await this.repo.delete(id);
  }

}
