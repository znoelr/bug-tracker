import { Expose } from "class-transformer";

export class ProjectSortDto {
  @Expose()
  title: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
