import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../common/exception-handlers";
import { userRolesService } from "../../user/modules/user-roles/user-roles.service";
import { QueryFilters } from "../../common/types";
import { client } from "../../../infrastructure/redis";
import { cachePermissionsAccess, getPermissionKey } from "../../common/helpers/cache.helpers";
import { ForbiddenExeption } from "../../common/exceptions";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../../permission/permission.constants";

const getUserRolesIds = async (userId: string): Promise<string[]> => {
  const filters = new QueryFilters().setWhere({ userId });
  return (await userRolesService.findAll(filters)).map(userRole => userRole.roleId);
};

export const restrictTo = (action: keyof typeof PERMISSION_ACTION, resource: keyof typeof PERMISSION_RESOURCE) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const permissionKey = getPermissionKey(action, resource);
    let allowedRoleIdsStr = await client.get(permissionKey);
    if (!allowedRoleIdsStr) {
      await cachePermissionsAccess();
      allowedRoleIdsStr = await client.get(permissionKey);
      if (!allowedRoleIdsStr) {
        next(new ForbiddenExeption());
        return;
      }
    }

    const user = req.user;
    const allowedRoleIdsMap: {[key: string]: boolean} = JSON.parse(allowedRoleIdsStr);
    const cachedUserRoleIdsStr = await client.get(user.id);
    if (cachedUserRoleIdsStr) {
      const isUserAllowed = (JSON.parse(cachedUserRoleIdsStr)).some((roleId: string) => !!allowedRoleIdsMap[roleId]);
      if (!isUserAllowed) {
        next(new ForbiddenExeption());
      }
      next();
      return;
    }

    const userRoleIds = await getUserRolesIds(user.id);
    const thirtyMinInSeconds = 60 * 30;
    await client.setEx(user.id, thirtyMinInSeconds, JSON.stringify(userRoleIds));

    const isUserAllowed = userRoleIds.some((roleId: string) => !!allowedRoleIdsMap[roleId]);
    if (!isUserAllowed) {
      next(new ForbiddenExeption());
      return;
    }

    next();
  })
;
