import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserRolesDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}
