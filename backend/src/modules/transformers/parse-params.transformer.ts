export const injectComposedKeyIntoParams = (keys: string[]) => (params: any) => {
  const composedKeyName = keys.join('_');
  return {
    [composedKeyName]: keys.reduce((acc: any, key: string) => {
      acc[key] = params[key];
      return acc;
    }, {}),
  };
};

export const trimExistingParamsForKeys = (keys: string[]) => (params: any) => {
  return keys.reduce((acc: any, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});
};
