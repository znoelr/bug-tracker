import { client } from "../../../infrastructure/redis";
import { rolePermissionsService } from "../../role/modules/role-permissions/role-permissions.service";
import { QueryFilters, QueryOptions } from "../types";

export const getPermissionKey = (action: string, resource: string) => `${action}-${resource}`.toLowerCase();

export const cachePermissionsAccess = async () => {
  const filters = new QueryFilters().setWhere({});
  const options = new QueryOptions().setInclude({ permission: true });
  const rolePermissions = await rolePermissionsService.findAll(filters, options);
  const mappedPermissions = rolePermissions.reduce((acc: any, rolePermission) => {
    const { action, resource } = rolePermission.permission;
    const permissionKey = getPermissionKey(action, resource);
    acc[permissionKey] = acc[permissionKey] || {};
    acc[permissionKey][rolePermission.roleId] = true;
    return acc;
  }, {});
  for (const [permissionKey, roleIds] of Object.entries(mappedPermissions)) {
    await client.set(permissionKey, JSON.stringify(roleIds));
  }
};
