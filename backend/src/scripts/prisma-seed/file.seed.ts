import { v4 as uuid } from 'uuid';
import { prismaClient } from '../../infrastructure/prisma/prisma.client';
import { faker } from '@faker-js/faker';

export async function run() {
  const promises = new Array(50)
    .fill(null)
    .map(async () => await prismaClient.file.create({
        data: {
          id: uuid(),
          mimetype: faker.system.mimeType(),
          name: faker.commerce.productName(),
          url: faker.internet.url(),
        },
      })
    );

  return await Promise.all(promises);
}
