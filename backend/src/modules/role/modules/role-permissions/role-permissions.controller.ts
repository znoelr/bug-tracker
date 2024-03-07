import { BaseController } from "../../../base/base.controller";
import { RolePermissionsDto } from "./dtos/role-permissions.dto";
import { rolePermissionsService } from "./role-permissions.service";

class RolePermissionsController extends BaseController<RolePermissionsDto> {}

export default new RolePermissionsController(RolePermissionsDto, rolePermissionsService);
