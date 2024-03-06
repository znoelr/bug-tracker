import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../permission.constants";

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(PERMISSION_ACTION))
  action: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(PERMISSION_RESOURCE))
  resource: string;
}
