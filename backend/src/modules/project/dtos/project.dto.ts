import { Expose } from "class-transformer";

export class ProjectDto {
  @Expose()
  id: string;

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

  @Expose()
  createdById: string;
}
