export class QueryOptions {
  constructor(
    public readonly select: { [key: string]: any; } = {},
    public readonly include: { [key: string]: any; } = {},
    public readonly orderBy: { [key: string]: 'asc'|'desc' } = {},
  ) {}
}
