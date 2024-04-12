import jwt from 'jsonwebtoken';
import { BadRequestException, UnauthorizedExeption } from "../../common/exceptions";
import { QueryFilters } from "../../common/types";
import { UserService, userService } from "../user/user.service";
import { ConfigService } from '../../config/config.service';
import { compareHash } from '../../common/helpers';
import { TokenBlacklistModel } from '../token-blacklist/token-blacklist.schema';

export class AuthService {
  constructor(private readonly userService: UserService) {}

  private async setUserRefreshToken(userId: string, refreshToken: string | null) {
    const filters = new QueryFilters().setWhere({ id: userId });
    await this.userService.update({ refreshToken }, filters);
  }

  async login(username: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
    const filters = new QueryFilters().setWhere({ username: username.toLowerCase() });
    const  foundUser = await this.userService.findOne(filters);
    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }
    const isValidPassword = await compareHash(password, foundUser.password);
    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwtPayload = { sub: foundUser.id };
    const accessToken = jwt.sign(jwtPayload, ConfigService.get<string>('JWT_SECRET'), {
      expiresIn: Number(ConfigService.get<number>('JWT_EXPIRES_IN_SECONDS')),
    });
    const refreshExpiresInSeconds = Number(ConfigService.get<number>('JWT_EXPIRES_IN_DAYS')) * 60 * 60 * 24;
    const refreshToken = jwt.sign(jwtPayload, ConfigService.get<string>('JWT_REFRESH_SECRET'), {
      expiresIn: refreshExpiresInSeconds,
    });

    await this.setUserRefreshToken(foundUser.id, refreshToken);

    return { accessToken, refreshToken };
  }

  private async blacklistToken(token?: string) {
    if (!token) return;
    await new TokenBlacklistModel({ token }).save();
  }

  async logout(userId: string, accessToken: string, refreshToken: string) {
    await this.blacklistToken(accessToken);
    await this.blacklistToken(refreshToken);
    await this.setUserRefreshToken(userId, null);
  }

  async throwUnauthorizedOnBlacklistedToken(token: string) {
    const foundToken = await TokenBlacklistModel.findOne({ token });
    if (foundToken) throw new UnauthorizedExeption();
  }

  async refreshToken(prevAccessToken: string, refreshToken: string) {
    try {
      await this.blacklistToken(prevAccessToken);
      await this.throwUnauthorizedOnBlacklistedToken(refreshToken);
      const payload = jwt.verify(refreshToken, ConfigService.get<string>('JWT_REFRESH_SECRET'));
      const userId = payload.sub;
      const filters = new QueryFilters().setWhere({ id: userId, refreshToken });
      const foundUser = await userService.findOne(filters);
      if (!foundUser) throw new UnauthorizedExeption();
      // Create new Access token
      const jwtPayload = { sub: foundUser.id };
      const accessToken = jwt.sign(jwtPayload, ConfigService.get<string>('JWT_SECRET'), {
        expiresIn: Number(ConfigService.get<number>('JWT_EXPIRES_IN_SECONDS')),
      });
      return accessToken;
    }
    catch (error) {
      throw new UnauthorizedExeption();
    }
  }
}

export const authService = new AuthService(userService);
