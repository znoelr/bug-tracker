
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { prismaClient } from '../../repository/prisma/prisma.client';
import { PROJECT_STATUS } from '../../modules/project/project.constants';
import { ROLES } from '../../modules/role/role.constants';

export async function run(users: any[]) {
  const manager = users.find(u => u.username.toUpperCase() === ROLES.MANAGER);
  const promises = new Array(3)
    .fill(null)
    .map(async () => await prismaClient.project.create({
      data: {
        id: uuid(),
        title: `${faker.commerce.product()} -> ${uuid()}`,
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        status: PROJECT_STATUS.IN_PROGRESS,
        createdById: manager.id,
      },
    }));

  return await Promise.all(promises);
}
