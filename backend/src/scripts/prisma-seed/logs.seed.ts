import { v4 as uuid } from 'uuid';
import { prismaClient } from '../../infrastructure/prisma/prisma.client';
import { ROLES } from '../../modules/role/role.constants';
import { getRandomValue } from './helpers';
import { PERMISSION_ACTION } from '../../modules/permission/permission.constants';

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
          content: `Action "${getRandomValue<string>(Object.values(PERMISSION_ACTION))}" performed on ${task.type}`,
          triggeredById: getUserByTask(task).id,
        })
      )
    )
    .flat()
    .map(async (data) => await prismaClient.log.create({ data }));

  return await Promise.all(promises);
}
