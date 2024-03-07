import { PrismaBaseRepository } from "../../../../../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../../../../../repository/prisma/prisma.client";
import { TaskCommentFilesDto } from "./dtos/task-comment-files.dto";

export class TaskCommentFilesRepository extends PrismaBaseRepository<TaskCommentFilesDto> {
  constructor() {
    super(prismaClient.taskCommentFiles);
  }
}

export const taskCommentFilesRepository = new TaskCommentFilesRepository();
