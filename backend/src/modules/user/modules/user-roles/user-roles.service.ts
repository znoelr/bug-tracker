import { BaseService } from "../../../base/base.service";
import { UserRolesDto } from "./dtos/user-roles.dto";
import { userRolesRepository } from "./user-roles.repository";

export class UserRolesService extends BaseService<UserRolesDto> {}

export const userRolesService = new UserRolesService(userRolesRepository);
