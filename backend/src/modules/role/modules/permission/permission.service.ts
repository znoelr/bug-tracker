import { BaseService } from "../../../base/base.service";
import { PermissionDto } from "./dtos/permission.dto";
import { permissionRepository } from "./permission.repository";

export class PermissionService extends BaseService<PermissionDto> {}

export const permissionService = new PermissionService(permissionRepository);
