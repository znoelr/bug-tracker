import { BaseRepo } from "../../modules/base/base.repository";
import { Pagination, QueryFilters, QueryOptions } from "../../modules/common/types";

export class PrismaBaseRepo<T> implements BaseRepo<T> {
  constructor(protected readonly model: any) {}

  async findOne(filters: QueryFilters, queryOptions: QueryOptions): Promise<T|null> {
    const where: any = filters?.where || {};
    if (filters.or) where.OR = filters.or;
    const select = queryOptions?.select || {};
    const findQuery: any = { where };
    if (Object.keys(select).length > 0) findQuery.select = select;
    const record = await this.model.findUnique(findQuery);
    return record;
  }

  async findAll(pagination: Pagination, filters: QueryFilters, queryOptions: QueryOptions): Promise<T[]> {
    const list: any[] = await this.model.findMany();
    return list;
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
