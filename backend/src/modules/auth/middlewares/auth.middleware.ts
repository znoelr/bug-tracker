import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { catchAsync } from "../../common/exception-handlers";
import { JWT_COOKIE_NAME } from "../../common/constants";
import { UnauthorizedExeption } from "../../common/exceptions";
import { ConfigService } from "../../../config/config.service";
import { userService } from "../../user/user.service";
import { QueryFilters } from "../../common/types";
import { authService } from "../auth.service";

export const authMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies[JWT_COOKIE_NAME];
  if (!token) throw new UnauthorizedExeption();
  await authService.throwUnauthorizedOnBlacklistedToken(token);
  try {
    const payload = jwt.verify(token, ConfigService.get<string>('JWT_SECRET'));
    const userId = payload.sub;
    const filters = new QueryFilters().setWhere({ id: userId });
    const foundUser = await userService.findOne(filters);
    if (!foundUser) throw new UnauthorizedExeption();
    req.user = foundUser;
    next();
  }
  catch (error) {
    throw new UnauthorizedExeption();
  }
});
