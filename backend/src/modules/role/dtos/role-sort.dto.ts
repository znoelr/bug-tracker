import { Expose } from "class-transformer";

export class RoleSortDto {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
