export const objectReducerForKeys = (obj: any) => (acc: any, key: string) => {
  const [keyName, mappedKeyName] = key.split(':');
  if (obj[keyName]) {
    key = mappedKeyName || keyName;
    acc[key] = obj[keyName];
  }
  return acc;
};
