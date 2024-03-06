import { PrismaBaseRepository } from "../../../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../../../repository/prisma/prisma.client";
import { TaskCommentDto } from "./dtos/task-comment.dto";

export class TaskCommentRepository extends PrismaBaseRepository<TaskCommentDto> {
  constructor() {
    super(prismaClient.taskComment);
  }
}

export const taskCommentRepository = new TaskCommentRepository();
