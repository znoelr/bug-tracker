import { BaseController } from "../../../base/base.controller";
import { UserRolesDto } from "./dtos/user-roles.dto";
import { userRolesService } from "./user-roles.service";

class UserRolesController extends BaseController<UserRolesDto> {}

export default new UserRolesController(UserRolesDto, userRolesService);
