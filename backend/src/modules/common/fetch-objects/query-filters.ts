type WhereType = {
  [key: string]: any;
  OR?: {[key: string]: any}[];
  NOT?: {[key: string]: any}[];
  AND?: {[key: string]: any}[];
};

export class QueryFilters {
  constructor(public readonly where: WhereType = {}) {}
}
