import { BaseService } from '../base/base.service';
import { UserDto } from './dtos/user.dto';
import { userRepository } from './user.repository';

export class UserService extends BaseService<UserDto> {}

export const userService = new UserService(userRepository);
