import { prismaClient } from '../../infrastructure/prisma/prisma.client';
import { getRandomValue } from './helpers';

export async function run(tasks: any[], files: any[]) {
  const promises = files
    .map(async (file) => {
      return await prismaClient.taskFiles.create({
        data: {
          fileId: file.id,
          taskId: getRandomValue<any>(tasks).id,
        },
      });
    });

  return await Promise.all(promises);
}
