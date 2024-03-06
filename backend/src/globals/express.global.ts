import { Pagination, QueryFilters } from "../modules/common/fetch-objects";

declare global {
  namespace Express {
    interface Request {
      pagination: Pagination;
      queryFilters: QueryFilters;
    }
  }
}
