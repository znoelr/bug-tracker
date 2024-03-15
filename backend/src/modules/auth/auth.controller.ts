import { NextFunction, Request, Response } from "express";
import { AuthService, authService } from "./auth.service";

class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const jwt = await authService.login(username, password);
    const expDate = new Date();
    const oneHourInMillis = 1000 * 60 * 60;
    expDate.setTime(expDate.getTime() + oneHourInMillis);
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
