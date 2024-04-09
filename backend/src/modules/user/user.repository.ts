import { PrismaBaseRepository } from "../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../infrastructure/prisma/prisma.client";
import { UserDto } from "./dtos/user.dto";

export class UserRepository extends PrismaBaseRepository<UserDto> {
  public __name__: string = 'User';

  constructor() {
    super(prismaClient.user);
  }
}

export const userRepository = new UserRepository();
