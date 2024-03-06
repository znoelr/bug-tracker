import { v4 as uuid } from 'uuid';
import { prismaClient } from '../../repository/prisma/prisma.client';
import { ROLES } from '../../modules/role/role.constants';
import { capitalize } from './helpers';

export async function run() {
  const promises = Object.values(ROLES)
    .map(async (roleName) => await prismaClient.role.create({
      data: {
        id: uuid(),
        name: roleName,
        description: `Role for ${capitalize(roleName)}s`,
      },
    }));

  return await Promise.all(promises);
}
