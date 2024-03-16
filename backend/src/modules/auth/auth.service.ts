import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BadRequestException } from "../common/exceptions";
import { QueryFilters } from "../common/types";
import { UserService, userService } from "../user/user.service";
import { ConfigService } from '../../config/config.service';

export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(username: string, password: string): Promise<string> {
    const filters = new QueryFilters().setWhere({ username: username.toLowerCase() });
    const  foundUser = await this.userService.findOne(filters);
    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwtPayload = { sub: foundUser.id };
    return jwt.sign(jwtPayload, ConfigService.get<string>('JWT_SECRET'), {
      expiresIn: Number(ConfigService.get<number>('JWT_EXPIRES_IN_SECONDS')),
    });
  }
}

export const authService = new AuthService(userService);
