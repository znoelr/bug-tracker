import jwt from 'jsonwebtoken';
import { BadRequestException, UnauthorizedExeption } from "../common/exceptions";
import { QueryFilters } from "../common/types";
import { UserService, userService } from "../user/user.service";
import { ConfigService } from '../../config/config.service';
import { compareHash } from '../common/helpers';

export class AuthService {
  constructor(private readonly userService: UserService) {}

  private async updateUserRefreshToken(userId: string, refreshToken: string | null) {
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

    await this.updateUserRefreshToken(foundUser.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.updateUserRefreshToken(userId, null);
  }

  async refreshToken(token: string) {
    try {
      const payload = jwt.verify(token, ConfigService.get<string>('JWT_REFRESH_SECRET'));
      const userId = payload.sub;
      const filters = new QueryFilters().setWhere({ id: userId, refreshToken: token });
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
