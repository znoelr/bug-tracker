import { BaseController } from "../base/base.controller";
import { UserDto } from "./dtos/user.dto";
import { userService } from "./user.service";

class UserController extends BaseController<UserDto> {}

export default new UserController(UserDto, userService);
