
import { BaseRepository } from "../../modules/base/base.repository";
import { Pagination, QueryFilters, QueryOptions } from "../../modules/common/types";

export class PrismaBaseRepository<T> implements BaseRepository<T> {
  constructor(protected readonly model: any) {}

  parsePagination(pagination: Pagination | null) {
    if (!pagination) return {};
    const parsed: any = {};
    const { nextId, limit } = pagination;
    if (limit) parsed.take = limit;
    if (nextId) {
      parsed.skip = 1;
      parsed.cursor = { id: nextId };
    }
    return parsed;
  }

  parseQueryFilters(filters: QueryFilters | null) {
    if (!filters) return {};
    const parsed: any = {};
    const { where }: any = filters;
    if (where) parsed.where = where;
    return parsed;
  }

  parseQueryOptions(options: QueryOptions | null) {
    if (!options) return {};
    const parsed: any = {};
    const { select, include, orderBy } = options;
    if (select) parsed.select = select;
    if (include) parsed.include = include;
    if (orderBy) parsed.orderBy = orderBy;
    return parsed;
  }

  private mergeIntoPrismaOptions(pagination: Pagination | null, filters: QueryFilters | null, options: QueryOptions | null): any {
    return {
      ...this.parsePagination(pagination),
      ...this.parseQueryFilters(filters),
      ...this.parseQueryOptions(options),
    };
  }

  async findOne(filters: QueryFilters, queryOptions: QueryOptions): Promise<T|null> {
    const findArgs = this.mergeIntoPrismaOptions(null, filters, queryOptions);
    const record = await this.model.findUnique(findArgs);
    return record;
  }

  async findAll(pagination: Pagination, filters: QueryFilters, queryOptions: QueryOptions): Promise<T[]> {
    const findArgs = this.mergeIntoPrismaOptions(pagination, filters, queryOptions);
    const list: any[] = await this.model.findMany(findArgs);
    return list;
  }

  async create(data: any): Promise<T> {
    return await this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    return await this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return await this.model.delete({ where: { id } });
  }
}
