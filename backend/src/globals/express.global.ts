import { Pagination, QueryFilters, QueryOptions } from "../modules/common/fetch-objects";

declare global {
  namespace Express {
    interface Request {
      pagination: Pagination;
      queryFilters: QueryFilters;
      queryOptions: QueryOptions;
    }
  }
}
