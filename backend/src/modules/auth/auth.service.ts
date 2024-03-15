import { BadRequestException } from "../common/exceptions";
import { QueryFilters } from "../common/types";
import { UserService, userService } from "../user/user.service";

export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(username: string, password: string): Promise<string> {
    const filters = new QueryFilters().setWhere({ username });
    const  foundUser = await this.userService.findOne(filters);
    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }
    // TODO check bcrypt passwrod
    if (password !== foundUser.password) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwtPayload = { sub: foundUser.id };
    return `${jwtPayload}`;
  }

  async logout() {}
}

export const authService = new AuthService(userService);
