import { prismaClient } from '../../infrastructure/prisma/prisma.client';
import { ROLES } from '../../modules/role/role.constants';
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from '../../modules/permission/permission.constants';

async function createRolePermissions(role: any, permissions: any[]) {
  const promises = permissions.map(async (permission: any) => await prismaClient.rolePermissions.create({
    data: {
      permissionId: permission.id,
      roleId: role.id,
    },
  }));
  await Promise.all(promises);
}

function getManagerPermissions(permissions: any[]): any[] {
  const managerResources = [PERMISSION_RESOURCE.PROJECT, PERMISSION_RESOURCE.USER, PERMISSION_RESOURCE.BUG, PERMISSION_RESOURCE.FEATURE, PERMISSION_RESOURCE.TASK];
  const managerPermissions = permissions.filter((p) => managerResources.includes(p.resource));
  return managerPermissions;
}

function getDeveloperPermissions(permissions: any): any[] {
  const developerResources: any = {
    [PERMISSION_RESOURCE.BUG]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST ],
    [PERMISSION_RESOURCE.FEATURE]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST ],
    [PERMISSION_RESOURCE.TASK]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.CREATE, PERMISSION_ACTION.CREATE_LINK ],
    [PERMISSION_RESOURCE.BUG_COMMENT]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.DELETE, PERMISSION_ACTION.UPDATE, PERMISSION_ACTION.CREATE ],
    [PERMISSION_RESOURCE.FEATURE_COMMENT]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.DELETE, PERMISSION_ACTION.UPDATE,  PERMISSION_ACTION.CREATE ],
    [PERMISSION_RESOURCE.TASK_COMMENT]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.DELETE, PERMISSION_ACTION.UPDATE,  PERMISSION_ACTION.CREATE, PERMISSION_ACTION.CREATE_LINK, PERMISSION_ACTION.DELETE_LINK ],
    [PERMISSION_RESOURCE.FILE]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.CREATE, PERMISSION_ACTION.DELETE ],
  };
  const developerPermissions = permissions.filter(
    (p: any) => developerResources[p.resource] && developerResources[p.resource].includes(p.action)
  );
  return developerPermissions;
}

function getTesterPermissions(permissions: any[]): any[] {
  const testerResources: any = {
    [PERMISSION_RESOURCE.BUG]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.CREATE ],
    [PERMISSION_RESOURCE.TASK]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.CREATE, PERMISSION_ACTION.CREATE_LINK ],
    [PERMISSION_RESOURCE.FEATURE]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST ],
    [PERMISSION_RESOURCE.BUG_COMMENT]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.DELETE, PERMISSION_ACTION.UPDATE, PERMISSION_ACTION.CREATE ],
    [PERMISSION_RESOURCE.FEATURE_COMMENT]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.DELETE, PERMISSION_ACTION.UPDATE,  PERMISSION_ACTION.CREATE ],
    [PERMISSION_RESOURCE.TASK_COMMENT]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.DELETE, PERMISSION_ACTION.UPDATE,  PERMISSION_ACTION.CREATE, PERMISSION_ACTION.CREATE_LINK, PERMISSION_ACTION.DELETE_LINK ],
    [PERMISSION_RESOURCE.FILE]: [ PERMISSION_ACTION.GET, PERMISSION_ACTION.LIST, PERMISSION_ACTION.CREATE, PERMISSION_ACTION.DELETE ],
  };
  const testerPermissions = permissions.filter(
    (p: any) => testerResources[p.resource] && testerResources[p.resource].includes(p.action)
  );
  return testerPermissions;
}

export async function run(roles: any[], permissions: any[]) {
  const rolesMap = roles.reduce((acc, role) => (acc[role.name] = role, acc), {});

  await createRolePermissions(rolesMap[ROLES.ADMIN], permissions);
  await createRolePermissions(rolesMap[ROLES.MANAGER], getManagerPermissions(permissions));
  await createRolePermissions(rolesMap[ROLES.DEVELOPER], getDeveloperPermissions(permissions));
  await createRolePermissions(rolesMap[ROLES.TESTER], getTesterPermissions(permissions));
}
