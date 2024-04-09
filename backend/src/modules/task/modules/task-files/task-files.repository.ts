import { PrismaBaseRepository } from "../../../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../../../infrastructure/prisma/prisma.client";
import { TaskFilesDto } from "./dtos/task-files.dto";

export class TaskFilesRepository extends PrismaBaseRepository<TaskFilesDto> {
  public __name__: string = 'TaskFile';

  constructor() {
    super(prismaClient.taskFiles);
  }
}

export const taskFilesRepository = new TaskFilesRepository();
