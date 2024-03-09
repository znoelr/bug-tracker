export const createComposedKeyFromParams = (keys: string[]) => (params: any) => {
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
    const [keyName, mappedKeyName] = key.split(':');
    if (params[keyName]) {
      key = mappedKeyName || keyName;
      acc[key] = params[keyName];
    }
    return acc;
  }, {});
};
