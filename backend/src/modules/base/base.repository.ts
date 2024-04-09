import { Pagination, QueryFilters, QueryOptions } from "../../common/types";

export abstract class BaseRepository<T> {
  public abstract readonly __name__: string;

  abstract findOne(filters: QueryFilters, queryOptions?: QueryOptions): Promise<T|null>;
  abstract findAll(filters?: QueryFilters, queryOptions?: QueryOptions, pagination?: Pagination): Promise<T[]>;
  abstract create(data: any, queryOptions?: QueryOptions): Promise<T>;
  abstract update(data: any, filters: QueryFilters, queryOptions?: QueryOptions): Promise<T>;
  abstract delete(filters: QueryFilters, queryOptions?: QueryOptions): Promise<T>;

  abstract parsePagination(pagination: Pagination | null): any;
  abstract parseQueryFilters(filters?: QueryFilters | null): any;
  abstract parseQueryOptions(queryOptions?: QueryOptions | null): any;
}
