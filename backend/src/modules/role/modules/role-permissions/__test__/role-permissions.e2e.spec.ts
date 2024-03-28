import request from 'supertest';
import { Express } from "express";
import { v4 as uuid } from 'uuid';
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
let adminPermissions: PermissionDto[];

const urlPrefix = `/roles/:id/permissions`;

const getAdminPermissions = async (cookies: string[]) => {
  const { body } = await request(app)
    .get(`/roles/${adminRole.id}/permissions`)
    .set('Cookie', cookies)
    .expect(200);
  return body;
}

const createRole = async () => {
  const { body } = await request(app)
    .post('/roles')
    .set('Cookie', cookies)
    .send({
      name: `TEST_ROLE - ${Date.now()} - ${Math.random()}`,
      description: 'Descriptio for TEST_ROLE',
    })
    .expect(201);
  return body;
};

describe('[ROLE_PERMISSIONS]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    adminUser = await fetchUser({username: ROLES.ADMIN.toLowerCase()});
    adminRole = await fetchRole({name: ROLES.ADMIN});
    cookies = global.signin(adminUser.id);
    adminPermissions = await getAdminPermissions(cookies);
  });

  describe(`GET ${urlPrefix}`, () => {
    it('should return a list', async () => {
      const response = await request(app)
        .get(urlPrefix.replace(':id', adminRole.id))
        .set('Cookie', cookies)
        .expect(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(urlPrefix.replace(':id', adminRole.id))
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(urlPrefix.replace(':id', adminRole.id))
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`POST ${urlPrefix}`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const res = await request(app)
        .post(urlPrefix.replace(':id', adminRole.id))
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PUT ${urlPrefix}`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const res = await request(app)
        .put(urlPrefix.replace(':id', adminRole.id))
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PATCH ${urlPrefix}`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const res = await request(app)
        .patch(urlPrefix.replace(':id', adminRole.id))
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`DELETE ${urlPrefix}`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const res = await request(app)
        .delete(urlPrefix.replace(':id', adminRole.id))
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`GET ${urlPrefix}/:id`, () => {
    it('should return one record by ID', async () => {
      const permission = adminPermissions[0];
      const response = await request(app)
        .get(`${urlPrefix.replace(':id', adminRole.id)}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(permission.id);
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', adminRole.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', adminRole.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', adminRole.id)}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`POST ${urlPrefix}/:id`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const permission = adminPermissions[0];
      const res = await request(app)
        .post(`${urlPrefix.replace(':id', adminRole.id)}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PUT ${urlPrefix}/:id`, () => {
    it('should create a new record', async () => {
      const permission = adminPermissions[0];
      const newRole = await createRole();
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', newRole.id)}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(201);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(permission.id);
      expect(res.body.name).toBe(permission.name);
      expect(res.body.action).toBe(permission.action);
      expect(res.body.resource).toBe(permission.resource);

      const { body: newPermission } = await request(app)
        .get(`${urlPrefix.replace(':id', newRole.id)}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(newPermission).toBeDefined();
      expect(newPermission.id).toBe(permission.id);
    });

    it('should return Bad Request for existing record', async () => {
      const permission = adminPermissions[0];
      const newRole = await createRole();
      await request(app)
        .put(`${urlPrefix.replace(':id', newRole.id)}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(201);
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', newRole.id)}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Not Found for invalid ID', async () => {
      const newRole = await createRole();
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', newRole.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Not Found for invalid role ID', async () => {
      const permission = adminPermissions[0];
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', uuid())}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Not Found for invalid IDs', async () => {
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', uuid())}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it.todo('should update cached permissions');

    it.todo('should NOT update cached permissions on error response');

    it('should return Unauthorized for missing credentials', async () => {
      const permission = adminPermissions[0];
      const newRole = await createRole();
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', newRole.id)}/${permission.id}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const permission = adminPermissions[0];
      const newRole = await createRole();
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', newRole.id)}/${permission.id}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PATCH ${urlPrefix}/:id`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const newRole = await createRole();
      const res = await request(app)
        .patch(`${urlPrefix.replace(':id', newRole.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`DELETE ${urlPrefix}/:id`, () => {
    it('should delete one record by ID', async () => {
      const permission = adminPermissions[0];
      const newRole = await createRole();
      await request(app)
        .put(`${urlPrefix.replace(':id', newRole.id)}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(201);
      await request(app)
        .delete(`${urlPrefix.replace(':id', newRole.id)}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(204);
    });

    it('should return Not Found for invalid ID', async () => {
      const newRole = await createRole();
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', newRole.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Not Found for invalid role ID', async () => {
      const permission = adminPermissions[0];
      const newRole = await createRole();
      await request(app)
        .put(`${urlPrefix.replace(':id', newRole.id)}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(201);
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', uuid())}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Not Found for invalid IDs', async () => {
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', uuid())}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const newRole = await createRole();
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', newRole.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const newRole = await createRole();
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', newRole.id)}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });
});
