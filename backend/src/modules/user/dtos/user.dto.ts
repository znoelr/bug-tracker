import { Exclude, Expose } from "class-transformer";

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
