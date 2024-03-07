import { IsNotEmpty, IsString } from "class-validator";

export class CrateUserRolesDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}
