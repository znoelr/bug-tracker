import { objectReducerForKeys } from "../common/reducers";

export const createComposedKeyFromParams = (keys: string[]) => (params: any) => {
  const composedKeyName = keys.join('_');
  return {
    [composedKeyName]: keys.reduce(objectReducerForKeys(params), {}),
  };
};

export const trimExistingParamsForKeys = (keys: string[]) => (params: any) => {
  return keys.reduce(objectReducerForKeys(params), {});
};
