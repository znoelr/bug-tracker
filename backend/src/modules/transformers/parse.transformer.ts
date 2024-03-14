import { objectReducerForKeys } from "../common/reducers";
import { QueryOptions, QueryOptionsTransformerCb } from "../common/types";

export const createComposedKeyFromObjectKeys = (keys: string[]) => (obj: any) => {
  const composedKeyName = keys.join('_');
  return {
    [composedKeyName]: keys.reduce(objectReducerForKeys(obj), {}),
  };
};

export const trimObjectForKeys = (keys: string[]) => (obj: any) => {
  return keys.reduce(objectReducerForKeys(obj), {});
};

export const trimOnlyFirstEntryOfSortByForField = (fieldName: string) => (queryOptions: QueryOptions) => {
  const sortBy: any = { createdAt: 'desc' };
  const sortEntries = Object.entries(queryOptions.sortBy);
  if (!sortEntries.length) return queryOptions.setSortBy(sortBy);
  const [[field, sortDirection]] = sortEntries;
  return queryOptions.setSortBy({
    [fieldName]: { [field]: sortDirection },
  });
};

export const injectSelectOrIncludeQueryOptionsForKey = (key: string): QueryOptionsTransformerCb =>
  (queryOptions: QueryOptions): QueryOptions => {
    const { select } = queryOptions;
    const hasSelectKeys = Object.keys(select).length > 0;
    if (!hasSelectKeys) {
      return queryOptions.setInclude({ [key]: true });
    }
    return queryOptions
      .setSelect({ [key]: { select } })
      .setInclude({});
  }
;
