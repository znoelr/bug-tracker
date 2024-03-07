export class QueryOptions {
  private _select: { [key: string]: any; } = {};
  private _include: { [key: string]: any; } = {};
  private _orderBy: { [key: string]: 'asc'|'desc' } = { createdAt: 'desc' };

  get select() {return this._select; }
  setSelect(value: any): QueryOptions {
    if (!value || typeof value !== 'object') return this;
    this._select = value;
    return this;
  }

  get include() { return this._include; }
  setInclude(value: any): QueryOptions {
    if (!value || typeof value !== 'object') return this;
    this._include = value;
    return this;
  }

  get orderBy() { return this._orderBy; }
  setOrderBy(value: any): QueryOptions {
    if (!value || typeof value !== 'object') return this;
    this._orderBy = value;
    return this;
  }
}
