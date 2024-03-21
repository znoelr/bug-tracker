import { PrismaBaseRepository } from "../../../../../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../../../../../infrastructure/prisma/prisma.client";
import { TaskCommentFilesDto } from "./dtos/task-comment-files.dto";

export class TaskCommentFilesRepository extends PrismaBaseRepository<TaskCommentFilesDto> {
  constructor() {
    super(prismaClient.taskCommentFiles);
  }
}

export const taskCommentFilesRepository = new TaskCommentFilesRepository();
