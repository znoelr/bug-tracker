import { Expose } from "class-transformer";

export class LogSortDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
