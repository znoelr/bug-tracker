import { BaseController } from "../../../base/base.controller";
import { PermissionDto } from "./dtos/permission.dto";
import { permissionService } from "./permission.service";

class PermissionController extends BaseController<PermissionDto> {}

export default new PermissionController(PermissionDto, permissionService);
