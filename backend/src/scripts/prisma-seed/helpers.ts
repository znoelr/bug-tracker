export function getRandomValue<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function capitalize(str: string): string {
  if (!str) return '';
  return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
}
