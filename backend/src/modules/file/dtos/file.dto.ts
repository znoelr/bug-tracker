import { Expose } from "class-transformer";

export class FileDto {
  @Expose()
  id: string;

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
