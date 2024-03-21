import jwt from 'jsonwebtoken';
import { BadRequestException } from "../common/exceptions";
import { QueryFilters } from "../common/types";
import { UserService, userService } from "../user/user.service";
import { ConfigService } from '../../config/config.service';
import { compareHash } from '../common/helpers';

export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(username: string, password: string): Promise<{ access_token: string, refresh_token: string }> {
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
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

export const authService = new AuthService(userService);
