import { Expose } from "class-transformer"
import { PermissionDto } from "../../../../permission/dtos/permission.dto";

export class RolePermissionsDto {
  @Expose()
  permission: PermissionDto;
}
