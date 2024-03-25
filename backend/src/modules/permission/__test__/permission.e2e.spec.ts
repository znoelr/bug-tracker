import request from 'supertest';
import { Express } from 'express';
import { bootstrapApp } from '../../../app';
import { fetchPermissions, fetchUser } from '../../../scripts/prisma-seed/fetch-records';
import { ROLES } from '../../role/role.constants';
import { UserDto } from '../../user/dtos/user.dto';
import { PermissionDto } from '../dtos/permission.dto';
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from '../permission.constants';

let app: Express;
let adminUser: UserDto;
let cookies: string[];
let permissions: PermissionDto[];

describe('[PERMISSION]', () => {
  beforeAll(async() => {
    app = await bootstrapApp();
    adminUser = await fetchUser({ username: ROLES.ADMIN.toLowerCase() })
    permissions = await fetchPermissions({
      action: PERMISSION_ACTION.GET,
      resource: PERMISSION_RESOURCE.TASK,
    });
    cookies = await global.signin(adminUser.id);
  });

  it('should return a list of permissions', async () => {
    const res = await request(app)
      .get('/permissions')
      .set('Cookie', cookies)
      .expect(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return a specified permission by ID', async () => {
    const res = await request(app)
      .get(`/permissions/${permissions[0].id}`)
      .set('Cookie', cookies)
      .expect(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(permissions[0].id);
  });

  it('should return 404 on invalid permission ID', async () => {
    await request(app)
      .get(`/permissions/${Date.now()}`)
      .set('Cookie', cookies)
      .expect(404);
  });
});
