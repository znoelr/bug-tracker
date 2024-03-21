import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../../common/exception-handlers";
import { client } from "../../../../redis";
import { cachePermissionsAccess } from "../../../../common/helpers/cache.helpers";

export const resetCachedPermissions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await client.flushAll();
    await cachePermissionsAccess();
  }
  finally {
    next();
  }
});
