import { NextFunction, Request, Response } from "express";
import { AuthService, authService } from "./auth.service";
import { ConfigService } from "../../config/config.service";
import { JWT_COOKIE_NAME, JWT_REFRESH_COOKIE_NAME } from "../common/constants";
import { client } from "../../infrastructure/redis";
import { UnauthorizedExeption } from "../common/exceptions";

class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getCookieExpDate(expInSeconds: number): Date {
    const expDate = new Date();
    const expInMillis = expInSeconds * 1000;
    expDate.setTime(expDate.getTime() + expInMillis);
    return expDate;
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const { accessToken, refreshToken } = await this.authService.login(username, password);
    // Access jwt cookie
    const expInSeconds = Number(ConfigService.get<number>('JWT_EXPIRES_IN_SECONDS'));
    res.cookie(JWT_COOKIE_NAME, accessToken, {
      expires: this.getCookieExpDate(expInSeconds),
      secure: !['test', 'development'].includes(ConfigService.get('NODE_ENV')),
    });
    // Refresh jwt cookie
    const expInSecondsRefresh = Number(ConfigService.get<number>('JWT_EXPIRES_IN_DAYS')) * 60 * 60 * 24;
    res.cookie(JWT_REFRESH_COOKIE_NAME, refreshToken, {
      expires: this.getCookieExpDate(expInSecondsRefresh),
      secure: !['test', 'development'].includes(ConfigService.get('NODE_ENV')),
    });
    res.json({ accessToken, refreshToken });
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    // Revoke JWT, remove user id from redis cache, and clear cookies
    const user = req.user;
    await client.del(user.id);
    const accessToken: string = req.cookies[JWT_COOKIE_NAME];
    const refreshToken: string = req.cookies[JWT_REFRESH_COOKIE_NAME];
    await this.authService.logout(user.id, accessToken, refreshToken);
    // Clear access token
    res.clearCookie(JWT_COOKIE_NAME, {
      secure: !['test', 'development'].includes(ConfigService.get('NODE_ENV')),
    });
    // Clear refresh token
    res.clearCookie(JWT_REFRESH_COOKIE_NAME,{
      secure: !['test', 'development'].includes(ConfigService.get('NODE_ENV')),
    });
    res.status(204).end();
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const accessToken: string = req.cookies[JWT_COOKIE_NAME];
    const refreshToken: string = req.cookies[JWT_REFRESH_COOKIE_NAME];
    if (!refreshToken) throw new UnauthorizedExeption();
    const newAccessToken = await this.authService.refreshToken(accessToken, refreshToken);
    const expInSeconds = Number(ConfigService.get<number>('JWT_EXPIRES_IN_SECONDS'));
    res.cookie(JWT_COOKIE_NAME, newAccessToken, {
      expires: this.getCookieExpDate(expInSeconds),
      secure: !['test', 'development'].includes(ConfigService.get('NODE_ENV')),
    });
    res.json({ newAccessToken });
  }
}

export default new AuthController(authService);
