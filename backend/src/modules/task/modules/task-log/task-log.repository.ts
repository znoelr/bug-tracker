import { PrismaBaseRepository } from "../../../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../../../repository/prisma/prisma.client";
import { TaskLogDto } from "./dtos/task-log.dto";

export class TaskLogRepository extends PrismaBaseRepository<TaskLogDto> {
  constructor() {
    super(prismaClient.taskLog);
  }
}

export const taskLogRepository = new TaskLogRepository();
