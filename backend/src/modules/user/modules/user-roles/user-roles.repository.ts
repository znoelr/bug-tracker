import { PrismaBaseRepository } from "../../../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../../../infrastructure/prisma/prisma.client";
import { UserRolesDto } from "./dtos/user-roles.dto";

export class UserRolesRepository extends PrismaBaseRepository<UserRolesDto> {
  public __name__: string = 'UserRole';

  constructor() {
    super(prismaClient.userRoles);
  }
}

export const userRolesRepository = new UserRolesRepository();
