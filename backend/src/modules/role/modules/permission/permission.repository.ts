import { PrismaBaseRepository } from "../../../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../../../repository/prisma/prisma.client";
import { PermissionDto } from "./dtos/permission.dto";

export class PermissionRepository extends PrismaBaseRepository<PermissionDto> {
  constructor() {
    super(prismaClient.permission);
  }
}

export const permissionRepository = new PermissionRepository();
