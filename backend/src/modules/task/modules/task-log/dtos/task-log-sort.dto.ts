import { Expose } from "class-transformer";

export class TaskLogSortDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
