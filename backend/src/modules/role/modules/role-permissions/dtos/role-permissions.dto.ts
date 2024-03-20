import { Exclude, Expose } from "class-transformer"
import { PermissionDto } from "../../../../permission/dtos/permission.dto";

export class RolePermissionsDto {
  @Exclude()
  roleId: string;

  @Exclude()
  permissionId: string;

  @Expose()
  permission: PermissionDto;
}
