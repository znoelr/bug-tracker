import { NextFunction, Request, Response } from "express";
import { AuthService, authService } from "./auth.service";
import { ConfigService } from "../../config/config.service";

class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const jwt = await this.authService.login(username, password);
    const expDate = new Date();
    const expInSeconds = Number(ConfigService.get<number>('JWT_EXPIRES_IN_SECONDS'));
    const expInMillis = expInSeconds * 1000;
    expDate.setTime(expDate.getTime() + expInMillis);
    res.cookie('auth_token', jwt, {
      expires: expDate,
      secure: true,
    });
    res.json({ auth_token: jwt });
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    // Revoke JWT, and clear cookies
  }
}

export default new AuthController(authService);
