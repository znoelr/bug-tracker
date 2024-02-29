
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { prismaClient } from '../../repository/prisma/prisma.client';

export async function run() {
  const list: any[] = [];
  for (let i = 0; i < 20; i++) {
    const data = {
      id: uuid(),
      title: faker.commerce.product(),
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      status: 'IN_PROGRESS',
    };
    const entity = await prismaClient.project.create({ data });
    list.push(entity);
  }
  list;
}
