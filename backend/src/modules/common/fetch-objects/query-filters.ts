type WhereType = {
  [key: string]: any;
  OR?: {[key: string]: any}[];
  NOT?: {[key: string]: any}[];
  AND?: {[key: string]: any}[];
};

export class QueryFilters {
  private _where: WhereType = {};

  get where() { return this._where; }
  setWhere(value: any): QueryFilters {
    if (!value || typeof value !== 'object') return this;
    this._where = value;
    return this;
  }
}
