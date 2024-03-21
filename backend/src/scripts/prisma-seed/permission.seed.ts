import { v4 as uuid } from 'uuid';
import { prismaClient } from '../../infrastructure/prisma/prisma.client';
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from '../../modules/permission/permission.constants';
import { capitalize } from './helpers';

export async function run() {
  const promises = Object.values(PERMISSION_RESOURCE)
    .map((resource) => Object.values(PERMISSION_ACTION)
      .map((action) => ({
        id: uuid(),
        name: `'${capitalize(action)}' on '${capitalize(resource)}'`,
        description: `Permission to perform '${action.toLowerCase()}' on '${resource.toLowerCase()}'`,
        action: action,
        resource: resource,
      }))
    )
    .flat()
    .map(async (data) => await prismaClient.permission.create({ data }));
  
  return await Promise.all(promises);
}
