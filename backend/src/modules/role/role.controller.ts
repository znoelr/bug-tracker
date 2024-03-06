import { BaseController } from "../base/base.controller";
import { RoleDto } from "./dtos/role.dto";
import { roleService } from "./role.service";

class RoleController extends BaseController<RoleDto> {}

export default new RoleController(RoleDto, roleService);
