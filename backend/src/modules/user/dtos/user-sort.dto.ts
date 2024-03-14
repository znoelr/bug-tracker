import { Expose } from "class-transformer";

export class UserSortDto {
  @Expose()
  username: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
