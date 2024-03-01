import { Pagination, QueryFilters, QueryOptions } from "../common/types";

export interface BaseRepository<T> {
  findOne(filters: QueryFilters, queryOptions?: QueryOptions): Promise<T|null>;
  findAll(pagination: Pagination, filters?: QueryFilters, queryOptions?: QueryOptions): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;

  parsePagination(pagination: Pagination | null): any;
  parseQueryFilters(filters?: QueryFilters | null): any;
  parseQueryOptions(queryOptions?: QueryOptions | null): any;
}
