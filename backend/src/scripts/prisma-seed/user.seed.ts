
import { v4 as uuid } from 'uuid';
import { prismaClient } from '../../repository/prisma/prisma.client';
import { ROLES } from '../../modules/role/role.constants';

export async function run() {
  const promises = Object.values(ROLES)
    .map(r => r.toLowerCase())
    .map(async (username) => await prismaClient.user.create({
      data: {
        id: uuid(),
        username,
        password: 'abcde$12345',
      }
    }));
  return await Promise.all(promises);
}
