import { PrismaBaseRepository } from "../../../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../../../infrastructure/prisma/prisma.client";
import { RolePermissionsDto } from "./dtos/role-permissions.dto";

export class RolePermissionsRepository extends PrismaBaseRepository<RolePermissionsDto> {
  constructor() {
    super(prismaClient.rolePermissions);
  }
}

export const rolePermissionsRepository = new RolePermissionsRepository();
