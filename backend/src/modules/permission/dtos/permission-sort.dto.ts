import { Expose } from "class-transformer";

export class PermissionSortDto {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  action: string;

  @Expose()
  resource: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
