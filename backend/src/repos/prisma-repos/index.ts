import { prismaClient } from './prisma.client';
import { BaseRepo } from "../../modules/base/base.repository";
import { TaskDto } from "../../modules/task/dtos/task.dto";
import { TaskRepo } from "./task.repo";

class PrismaRepos {
  public TaskRepo: BaseRepo<TaskDto> = new TaskRepo(prismaClient.task);
}

export const repository = new PrismaRepos();

export async function connect() {
  await prismaClient.$connect();
}

export async function disconnect() {
  await prismaClient.$disconnect()
    .catch(async () => await prismaClient.$disconnect());
}
