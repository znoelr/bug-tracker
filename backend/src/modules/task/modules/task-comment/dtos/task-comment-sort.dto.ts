import { Expose } from "class-transformer";

export class TaskCommentSortDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
