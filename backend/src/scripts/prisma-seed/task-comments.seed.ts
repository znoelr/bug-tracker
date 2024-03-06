import { v4 as uuid } from 'uuid';
import { prismaClient } from '../../repository/prisma/prisma.client';
import { faker } from '@faker-js/faker';
import { ROLES } from '../../modules/role/role.constants';
import { getRandomValue } from './helpers';

export async function run(users: any[], tasks: any[]) {
  const developer = users.find(u => u.username.toUpperCase() === ROLES.DEVELOPER);
  const tester = users.find(u => u.username.toUpperCase() === ROLES.TESTER);

  const getUserByTask = (task: any) => {
    if (task.title.startsWith('BUG - ')) return tester;
    return developer;
  }
  
  const promises = tasks.map(
    (task) => new Array(getRandomValue<number>([3, 5, 1, 2, 7]))
      .fill(null)
      .map(() => ({
          id: uuid(),
          createdById: getUserByTask(task).id,
          content: faker.lorem.slug(),
          taskId: task.id,
        })
      )
    )
    .flat()
    .map(async (data) => await prismaClient.taskComment.create({ data }));

  return await Promise.all(promises);
}
