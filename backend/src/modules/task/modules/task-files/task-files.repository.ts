import { PrismaBaseRepository } from "../../../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../../../infrastructure/prisma/prisma.client";
import { TaskFilesDto } from "./dtos/task-files.dto";

export class TaskFilesRepository extends PrismaBaseRepository<TaskFilesDto> {
  constructor() {
    super(prismaClient.taskFiles);
  }
}

export const taskFilesRepository = new TaskFilesRepository();
