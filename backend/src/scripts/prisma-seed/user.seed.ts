
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { prismaClient } from '../../repository/prisma/prisma.client';

export async function run() {
  const list: any[] = [];
  for (let i = 0; i < 7; i++) {
    const data = {
      id: uuid(),
      username: faker.internet.userName(),
      password: faker.word.noun(),
    };
    const entity = await prismaClient.user.create({ data });
    list.push(entity);
  }
  list;
}
