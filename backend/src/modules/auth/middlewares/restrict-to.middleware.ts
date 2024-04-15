import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../common/exception-handlers";
import { userRolesService } from "../../user/modules/user-roles/user-roles.service";
import { QueryFilters } from "../../../common/types";
import { client } from "../../../infrastructure/redis";
import { cachePermissionsAccess, getPermissionKey } from "../../../common/helpers/cache.helpers";
import { ForbiddenExeption } from "../../../common/exceptions";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../../permission/permission.constants";
import { UserRolesModel } from "../../../mongo-storage/user-roles.schema";

const createForbiddenMessage = (action: string, resource: string) =>
  `You are lacking "${action}" access on "${resource}", please contact your manager to provide you the needed access`;

export const getUserRolesIds = async (userId: string): Promise<string[]> => {
  const filters = new QueryFilters().setWhere({ userId });
  return (await userRolesService.findAll(filters)).map(userRole => userRole.roleId);
};

export const saveUserRoles = async (userId: string, userRoleIds: string[]) => {
  await UserRolesModel.updateOne(
    { userId },
    { $set: { rolesIds: userRoleIds } },
    { upsert: true }
  );
};

export const restrictTo = (action: keyof typeof PERMISSION_ACTION, resource: keyof typeof PERMISSION_RESOURCE) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const forbiddenMessage = createForbiddenMessage(action, resource);

    const permissionKey = getPermissionKey(action, resource);
    let allowedRoleIdsStr = await client.get(permissionKey);
    if (!allowedRoleIdsStr) {
      await cachePermissionsAccess();
      allowedRoleIdsStr = await client.get(permissionKey);
      if (!allowedRoleIdsStr) {
        next(new ForbiddenExeption(forbiddenMessage));
        return;
      }
    }

    const user = req.user;
    const allowedRoleIdsMap: {[key: string]: boolean} = JSON.parse(allowedRoleIdsStr);
    const foundUserRoles = await UserRolesModel.findOne({ userId: user.id });
    if (foundUserRoles) {
      const isUserAllowed = foundUserRoles.rolesIds.some((roleId: string) => !!allowedRoleIdsMap[roleId]);
      if (!isUserAllowed) {
        next(new ForbiddenExeption(forbiddenMessage));
      }
      next();
      return;
    }

    const userRoleIds = await getUserRolesIds(user.id);
    await saveUserRoles(user.id, userRoleIds);

    const isUserAllowed = userRoleIds.some((roleId: string) => !!allowedRoleIdsMap[roleId]);
    if (!isUserAllowed) {
      next(new ForbiddenExeption(forbiddenMessage));
      return;
    }

    next();
  })
;
