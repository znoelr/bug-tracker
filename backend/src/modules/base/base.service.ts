import { BaseRepository } from "./base.repository";
import { Pagination, QueryFilters, QueryOptions } from "../common/types";

export class BaseService<T> {
  constructor(protected readonly repo: BaseRepository<T>) {}

  async findOne(filters: QueryFilters, queryOptions?: QueryOptions): Promise<T|null> {
    return await this.repo.findOne(filters, queryOptions);
  }

  async findAll(pagination: Pagination, queryFilters?: QueryFilters, queryOptions?: QueryOptions): Promise<T[]> {
    return await this.repo.findAll(pagination, queryFilters, queryOptions);
  }

  async create(data: any, queryOptions?: QueryOptions): Promise<T> {
    return await this.repo.create(data, queryOptions);
  }

  async update(data: any, queryFilters: QueryFilters, queryOptions?: QueryOptions): Promise<T> {
    return await this.repo.update(data, queryFilters, queryOptions);
  }

  async delete(queryFilters: QueryFilters, queryOptions?: QueryOptions): Promise<T> {
    return await this.repo.delete(queryFilters, queryOptions);
  }
}
