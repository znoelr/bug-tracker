
export const toEntityForKey = (key: string) => (data: any) => data[key];

export const toEntityListForKey = (key: string) => (data: any[]) => data.map((record) => record[key]);
