import { PrismaBaseRepository } from "../../../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../../../repository/prisma/prisma.client";
import { TaskFilesDto } from "./dtos/task-files.dto";

export class TaskFilesRepository extends PrismaBaseRepository<TaskFilesDto> {
  constructor() {
    super(prismaClient.taskFiles);
  }
}

export const taskFilesRepository = new TaskFilesRepository();
