import { UserRolesDto } from "../dtos/user-roles.dto";

export const userRolesToRoles = (data: UserRolesDto[]) => data.map(({ role }) => role);

export const userRoleToRole = ({ role }: UserRolesDto) => role;
