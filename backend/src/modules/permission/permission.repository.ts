import { PrismaBaseRepository } from "../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../infrastructure/prisma/prisma.client";
import { PermissionDto } from "./dtos/permission.dto";

export class PermissionRepository extends PrismaBaseRepository<PermissionDto> {
  public __name__: string = 'Permission';

  constructor() {
    super(prismaClient.permission);
  }
}

export const permissionRepository = new PermissionRepository();
