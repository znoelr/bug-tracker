import { TaskDto } from "./dtos/task.dto";
import { PrismaBaseRepository } from "../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../infrastructure/prisma/prisma.client";

export class TaskRepository extends PrismaBaseRepository<TaskDto> {
  public __name__: string = 'Task';

  constructor() {
    super(prismaClient.task);
  }
}

export const taskRepository = new TaskRepository();
