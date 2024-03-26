import { instanceToPlain, plainToInstance } from "class-transformer";

export function serialize<T>(DtoClass: {new(): T}, data: any) {
  const instance = plainToInstance(DtoClass, data, { excludeExtraneousValues: true });
  return instanceToPlain(instance);
}

export function deserialize<T>(DtoClass: {new(): T}, data: any) {
  return plainToInstance(DtoClass, data, { excludeExtraneousValues: true });
}
