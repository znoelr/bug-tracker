import { objectReducerForKeys } from "../common/reducers";
import { QueryOptions } from "../common/types";

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
