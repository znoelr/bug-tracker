import { Pagination, QueryFilters, QueryOptions } from "../modules/common/types";

export interface BaseRepo<T> {
  findOne(filters: QueryFilters, queryOptions?: QueryOptions): Promise<T|null>;
  findAll(pagination: Pagination, filters?: QueryFilters, queryOptions?: QueryOptions): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
}
