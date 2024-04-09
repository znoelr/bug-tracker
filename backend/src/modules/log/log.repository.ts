import { PrismaBaseRepository } from "../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../infrastructure/prisma/prisma.client";
import { LogDto } from "./dtos/log.dto";

export class LogRepository extends PrismaBaseRepository<LogDto> {
  public __name__: string = 'Log';

  constructor() {
    super(prismaClient.log);
  }
}

export const logRepository = new LogRepository();
