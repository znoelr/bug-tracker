import { Expose } from "class-transformer";
import { RoleDto } from "../../../../role/dtos/role.dto";

export class UserRolesDto {
  @Expose()
  userId: string;

  @Expose()
  roleId: string;

  @Expose()
  role: RoleDto;
}
