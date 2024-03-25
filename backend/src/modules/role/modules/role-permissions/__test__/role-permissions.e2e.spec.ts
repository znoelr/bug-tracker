import { Express } from "express";
import request from 'supertest';
import { RoleDto } from '../../../dtos/role.dto';
import { bootstrapApp } from '../../../../../app';
import { UserDto } from "../../../../user/dtos/user.dto";
import { ROLES } from "../../../role.constants";
import { PermissionDto } from "../../../../permission/dtos/permission.dto";
import { fetchRole, fetchUser } from "../../../../../scripts/prisma-seed/fetch-records";

let app: Express;
let cookies: string[];
let adminUser: UserDto;
let adminRole: RoleDto;
let testRole: RoleDto;
let adminPermissions: PermissionDto[];

describe('[ROLE_PERMISSIONS]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    adminUser = await fetchUser({username: ROLES.ADMIN.toLowerCase()});
    adminRole = await fetchRole({name: ROLES.ADMIN});
    cookies = global.signin(adminUser.id);

    const { body: pBody } = await request(app)
      .get(`/roles/${adminRole.id}/permissions`)
      .set('Cookie', cookies)
      .expect(200);
      adminPermissions = pBody;

    const { body: rBody } = await request(app)
      .post('/roles')
      .set('Cookie', cookies)
      .send({
        name: `TEST_ROLE - ${Date.now()} - ${Math.random()}`,
        description: 'Descriptio for TEST_ROLE',
      })
      .expect(201);
    testRole = rBody;
  });

  it('should list all permissions for a specified role', async () => {
    const response = await request(app)
      .get(`/roles/${adminRole.id}/permissions`)
      .set('Cookie', cookies)
      .expect(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return a specified permission for a specified role', async () => {
    const response = await request(app)
      .get(`/roles/${adminRole.id}/permissions/${adminPermissions[0].id}`)
      .set('Cookie', cookies)
      .expect(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(adminPermissions[0].id);
  });

  it('should create a permission for a specified role', async () => {
    const response = await request(app)
      .put(`/roles/${testRole.id}/permissions/${adminPermissions[0].id}`)
      .set('Cookie', cookies)
      .expect(201);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(adminPermissions[0].id);
  });

  it('should delete a permission for a specified role', async () => {
    const response = await request(app)
      .put(`/roles/${testRole.id}/permissions/${adminPermissions[1].id}`)
      .set('Cookie', cookies)
      .expect(201);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(adminPermissions[1].id);

    await request(app)
      .delete(`/roles/${testRole.id}/permissions/${adminPermissions[1].id}`)
      .set('Cookie', cookies)
      .expect(204);
  });

  it('throws Bad Request on create, for existing role permissions', async () => {
    await request(app)
      .put(`/roles/${adminRole.id}/permissions/${adminPermissions[0].id}`)
      .set('Cookie', cookies)
      .expect(400);
  });

  it('throws Not Found on create, for bad permission ID', async () => {
    await request(app)
      .put(`/roles/${adminRole.id}/permissions/${Date.now()}`)
      .set('Cookie', cookies)
      .expect(404);
  });

  it('throws Not Found on delete, for bad permission ID', async () => {
    await request(app)
      .delete(`/roles/${adminRole.id}/permissions/${Date.now()}`)
      .set('Cookie', cookies)
      .expect(404);
  });
});
