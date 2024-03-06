import { Expose } from "class-transformer";

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  password: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

}
