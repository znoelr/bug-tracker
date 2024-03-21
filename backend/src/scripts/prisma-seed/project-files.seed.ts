import { prismaClient } from '../../infrastructure/prisma/prisma.client';
import { getRandomValue } from './helpers';

export async function run(projects: any[], files: any[]) {
  const promises = files
    .map(async (file) => {
      return await prismaClient.projectFiles.create({
        data: {
          fileId: file.id,
          projectId: getRandomValue<any>(projects).id,
        },
      });
    });

  return await Promise.all(promises);
}
