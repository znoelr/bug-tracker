import { Expose } from "class-transformer";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../permission.constants";

export class PermissionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  action: keyof typeof PERMISSION_ACTION;

  @Expose()
  resource: keyof typeof PERMISSION_RESOURCE;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
