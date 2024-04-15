import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../../../common/exception-handlers";
import { client } from "../../../../../infrastructure/redis";
import { cachePermissionsAccess } from "../../../../../common/helpers/cache.helpers";
import { getUserRolesIds, saveUserRoles } from "../../../../auth/middlewares/restrict-to.middleware";

export const resetCachedPermissions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await client.flushAll();
    await cachePermissionsAccess();
  }
  finally {
    next();
  }
});

export const resetCachedUserRoles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const userRoles = await getUserRolesIds(userId);
    await saveUserRoles(userId, userRoles);
  }
  finally {
    next();
  }
});
