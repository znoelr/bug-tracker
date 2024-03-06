import { PrismaBaseRepository } from "../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../repository/prisma/prisma.client";
import { RoleDto } from "./dtos/role.dto";

export class RoleRepository extends PrismaBaseRepository<RoleDto> {
  constructor() {
    super(prismaClient.role);
  }
}

export const roleRepository = new RoleRepository();
