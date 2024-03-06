export class Pagination {
  private _limit: number = 20;
  private _nextId: string = '';

  get limit() { return this._limit; }
  setLimit(value: any): Pagination {
    if (!value) return this;
    const limit = Number(value);
    if (Number.isNaN(limit)) return this;
    this._limit = limit;
    return this;
  }

  get nextId() { return this._nextId };
  setNextId(value: any): Pagination {
    if (!value) return this;
    this._nextId = String(value);
    return this;
  }
}
