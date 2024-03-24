import { prismaClient } from "../../infrastructure/prisma/prisma.client";
import { DBRecords } from "../../modules/common/types/db-records";

export async function fetchRecords(): Promise<DBRecords> {
  const records: any = {
    permissions: await prismaClient.permission.findMany(),
    roles: await prismaClient.role.findMany(),
    users: await prismaClient.user.findMany(),
    projects: await prismaClient.project.findMany(),
    tasks: await prismaClient.task.findMany(),
    taskComments: await prismaClient.taskComment.findMany(),
    taskLogs: await prismaClient.taskLog.findMany(),
    files: await prismaClient.file.findMany(),
  };
  return records as DBRecords;
}
