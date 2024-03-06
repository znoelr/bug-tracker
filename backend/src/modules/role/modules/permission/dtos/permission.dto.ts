import { Expose } from "class-transformer";

export class PermissionDto {
  @Expose()
  id: string;

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
