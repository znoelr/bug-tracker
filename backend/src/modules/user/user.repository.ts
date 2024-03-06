import { PrismaBaseRepository } from "../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../repository/prisma/prisma.client";
import { UserDto } from "./dtos/user.dto";

export class UserRepository extends PrismaBaseRepository<UserDto> {
  constructor() {
    super(prismaClient.user);
  }
}

export const userRepository = new UserRepository();
