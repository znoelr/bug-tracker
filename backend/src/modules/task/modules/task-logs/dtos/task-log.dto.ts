import { Expose } from "class-transformer";

export class TaskLogDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  taskId: string;

  @Expose()
  triggeredById: string;
}
