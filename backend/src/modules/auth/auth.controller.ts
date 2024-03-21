import { NextFunction, Request, Response } from "express";
import { AuthService, authService } from "./auth.service";
import { ConfigService } from "../../config/config.service";
import { JWT_COOKIE_NAME } from "../common/constants";
import { client } from "../redis";

class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const jwt = await this.authService.login(username, password);
    const expDate = new Date();
    const expInSeconds = Number(ConfigService.get<number>('JWT_EXPIRES_IN_SECONDS'));
    const expInMillis = expInSeconds * 1000;
    expDate.setTime(expDate.getTime() + expInMillis);
    res.cookie(JWT_COOKIE_NAME, jwt, {
      expires: expDate,
      secure: !['test', 'development'].includes(ConfigService.get('NODE_ENV')),
    });
    res.json({ auth_token: jwt });
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    // Revoke JWT, remove user id from redis cache, and clear cookies
    const user = req.user || { id: '' };
    await client.del(user.id);
    res.clearCookie(JWT_COOKIE_NAME, {
      secure: !['test', 'development'].includes(ConfigService.get('NODE_ENV')),
    });
    res.status(204).end();
  }
}

export default new AuthController(authService);
