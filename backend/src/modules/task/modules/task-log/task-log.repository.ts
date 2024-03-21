import { PrismaBaseRepository } from "../../../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../../../infrastructure/prisma/prisma.client";
import { TaskLogDto } from "./dtos/task-log.dto";

export class TaskLogRepository extends PrismaBaseRepository<TaskLogDto> {
  constructor() {
    super(prismaClient.taskLog);
  }
}

export const taskLogRepository = new TaskLogRepository();
