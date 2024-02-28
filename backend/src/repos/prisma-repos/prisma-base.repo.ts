import { BaseRepo } from "../base.repo";
import { QueryFilters, QueryOptions, Pagination } from "../../modules/common/types";

export class PrismaBaseRepo<T> implements BaseRepo<T> {
  constructor(protected readonly model: any) {}

  async findOne(filters: QueryFilters, queryOptions: QueryOptions): Promise<T | null> {
    return {
      query: {
        filters,
        queryOptions,
      }
    } as T;
  }

  async findAll(pagination: Pagination, filters: QueryFilters, queryOptions: QueryOptions): Promise<T[]> {
    throw new Error("Method not implemented.");
  }

  async create(data: any): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async update(id: string, data: any): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
}
