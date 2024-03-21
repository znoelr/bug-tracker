import { prismaClient } from '../../infrastructure/prisma/prisma.client';
import { getRandomValue } from './helpers';

export async function run(taskComments: any[], files: any[]) {
  const promises = files
    .map(async (file) => {
      return await prismaClient.taskCommentFiles.create({
        data: {
          fileId: file.id,
          taskCommentId: getRandomValue<any>(taskComments).id,
        },
      });
    });

  return await Promise.all(promises);
}
