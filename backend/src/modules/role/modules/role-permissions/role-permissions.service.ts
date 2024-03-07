import { BaseService } from "../../../base/base.service";
import { RolePermissionsDto } from "./dtos/role-permissions.dto";
import { rolePermissionsRepository } from "./role-permissions.repository";

export class RolePermissionsService extends BaseService<RolePermissionsDto> {}

export const rolePermissionsService = new RolePermissionsService(rolePermissionsRepository);
