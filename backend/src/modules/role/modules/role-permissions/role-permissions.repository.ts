import { PrismaBaseRepository } from "../../../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../../../repository/prisma/prisma.client";
import { RolePermissionsDto } from "./dtos/role-permissions.dto";

export class RolePermissionsRepository extends PrismaBaseRepository<RolePermissionsDto> {
  constructor() {
    super(prismaClient.rolePermissions);
  }
}

export const rolePermissionsRepository = new RolePermissionsRepository();
