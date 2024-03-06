import { v4 as uuid } from 'uuid';
import { prismaClient } from '../../repository/prisma/prisma.client';
import { faker } from '@faker-js/faker';
import { TASK_PRIORITY, TASK_SEVERITY, TASK_STATUS, TASK_TYPES } from '../../modules/task/task.constants';
import { ROLES } from '../../modules/role/role.constants';
import { getRandomValue } from './helpers';

export async function run(users: any[], projects: any[]) {
  const developer = users.find(u => u.username.toUpperCase() === ROLES.DEVELOPER);
  const tester = users.find(u => u.username.toUpperCase() === ROLES.TESTER);

  const developerPromises = new Array(14)
    .fill(null)
    .map(async () => {
      const project = getRandomValue<any>(projects);
      return await prismaClient.task.create({
        data: {
          id: uuid(),
          title: `${faker.commerce.product()} ${uuid()}`,
          description: faker.commerce.productDescription(),
          type: getRandomValue<string>(Object.values(TASK_TYPES)),
          status: getRandomValue<string>(Object.values(TASK_STATUS)),
          severity: null,
          priority: getRandomValue<string>(Object.values(TASK_PRIORITY)),
          assigneeId: developer.id,
          projectId: project.id,
        },
      });
    });

  const testerPromises = new Array(7)
    .fill(null)
    .map(async () => {
      const project = getRandomValue<any>(projects);
      return await prismaClient.task.create({
        data: {
          id: uuid(),
          title: `BUG - ${faker.commerce.product()} ${uuid()}`,
          description: faker.commerce.productDescription(),
          type: TASK_TYPES.BUG,
          status: TASK_STATUS.IN_REVIEW,
          severity: getRandomValue<string>(Object.values(TASK_SEVERITY)),
          priority: getRandomValue<string>(Object.values(TASK_PRIORITY)),
          assigneeId: tester.id,
          projectId: project.id,
        },
      });
    });

  return await Promise.all([...developerPromises, ...testerPromises]);
}
