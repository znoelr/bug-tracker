import { Pagination, QueryFilters, QueryOptions } from "../modules/common/types";

declare global {
  namespace Express {
    interface Request {
      pagination: Pagination;
      queryFilters: QueryFilters;
      queryOptions: QueryOptions;
    }
  }
}
