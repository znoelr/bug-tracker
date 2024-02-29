import { TaskDto } from "./dtos/task.dto";
import { PrismaBaseRepository } from "../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../repository/prisma/prisma.client";

export class TaskRepository extends PrismaBaseRepository<TaskDto> {
  constructor() {
    super(prismaClient.task);
  }
}

export const taskRepository = new TaskRepository();
