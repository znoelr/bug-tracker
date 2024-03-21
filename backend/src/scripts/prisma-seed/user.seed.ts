import { v4 as uuid } from 'uuid';
import { prismaClient } from '../../infrastructure/prisma/prisma.client';
import { ROLES } from '../../modules/role/role.constants';
import { hashStr } from '../../modules/common/helpers';

export async function run() {
  const promises = Object.values(ROLES)
    .map(r => r.toLowerCase())
    .map(async (username) => await prismaClient.user.create({
      data: {
        id: uuid(),
        username,
        password: hashStr('abcde$12345'),
      }
    }));
  return await Promise.all(promises);
}
