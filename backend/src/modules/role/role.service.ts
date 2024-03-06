import { BaseService } from '../base/base.service';
import { RoleDto } from './dtos/role.dto';
import { roleRepository } from './role.repository';

export class RoleService extends BaseService<RoleDto> {}

export const roleService = new RoleService(roleRepository);
