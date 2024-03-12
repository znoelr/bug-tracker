import { Expose } from "class-transformer";

export class UserSortDto {
  @Expose()
  username: string;

  @Expose()
  password: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
