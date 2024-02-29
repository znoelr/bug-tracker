import { Pagination, QueryFilters, QueryOptions } from "../common/types";

export interface BaseRepository<T> {
  parsePagination(pagination: Pagination | null): any;
  parseQueryFilters(filters?: QueryFilters | null): any;
  parseQueryOptions(queryOptions?: QueryOptions | null): any;

  findOne(filters: QueryFilters, queryOptions?: QueryOptions): Promise<T|null>;
  findAll(pagination: Pagination, filters?: QueryFilters, queryOptions?: QueryOptions): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
}
