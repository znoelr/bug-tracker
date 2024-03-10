import { objectReducerForKeys } from "../common/reducers";

export const createComposedKeyFromObjectKeys = (keys: string[]) => (obj: any) => {
  const composedKeyName = obj.join('_');
  return {
    [composedKeyName]: keys.reduce(objectReducerForKeys(obj), {}),
  };
};

export const trimObjectForKeys = (keys: string[]) => (obj: any) => {
  return keys.reduce(objectReducerForKeys(obj), {});
};
