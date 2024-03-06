import { ROLES } from '../../modules/role/role.constants';
import { prismaClient } from '../../repository/prisma/prisma.client';

export async function run(users: any[], roles: any[]) {
  const usersMap = users.reduce((acc, user) => (acc[user.username.toUpperCase()] = user, acc), {});
  const rolesMap = roles.reduce((acc, role) => (acc[role.name] = role, acc), {});
  const userRolesMap: { user: any, role: any } = Object.values(ROLES)
    .reduce((acc: any, roleName) => {
      acc[roleName] = {
        user: usersMap[roleName],
        role: rolesMap[roleName],
      };
      return acc;
    }, {});

  const promises = Object.values(userRolesMap)
    .map(async ({ user, role }) => await prismaClient.userRoles.create({
        data: {
          userId: user.id,
          roleId: role.id,
        }
      })
    );

  return await Promise.all(promises);
}
