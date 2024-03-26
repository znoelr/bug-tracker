import { Pagination, QueryFilters, QueryOptions } from "../common/types";
import { UserDto } from "../modules/user/dtos/user.dto";

declare global {
  namespace Express {
    interface Request {
      pagination: Pagination;
      queryFilters: QueryFilters;
      queryOptions: QueryOptions;
      user: UserDto;
    }
  }
}
