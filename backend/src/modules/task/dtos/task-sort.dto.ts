import { Expose } from "class-transformer";

export class TaskSortDto {
  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  type: string;

  @Expose()
  status: string;

  @Expose()
  severity: string;

  @Expose()
  priority: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
