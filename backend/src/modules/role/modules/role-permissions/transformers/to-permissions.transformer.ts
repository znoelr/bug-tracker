import { RolePermissionsDto } from "../dtos/role-permissions.dto";

export const rolePermissionsToPermissions = (data: RolePermissionsDto[]): any =>
  data.map(({ permission }) => permission)
;

export const rolePermissionToPermission = (data: RolePermissionsDto): any => data.permission;

