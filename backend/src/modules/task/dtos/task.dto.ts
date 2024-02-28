import { Expose } from "class-transformer";

export class TaskDto {
  @Expose()
  id: string = '';

  @Expose()
  title: string = '';

  @Expose()
  description: string = '';
}
