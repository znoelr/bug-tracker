import { Expose } from "class-transformer";

export class FileSortDto {
  @Expose()
  name: string;

  @Expose()
  mimetype: string;

  @Expose()
  url: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
