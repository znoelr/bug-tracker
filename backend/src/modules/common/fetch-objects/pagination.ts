export class Pagination {
  constructor(
    public readonly limit: number = 20,
    public readonly nextId: string = '',
  ) {}
}
