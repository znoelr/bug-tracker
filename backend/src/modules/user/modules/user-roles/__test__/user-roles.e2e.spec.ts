import request from 'supertest';
import { Express } from "express";
import { v4 as uuid } from 'uuid';
import { bootstrapApp } from '../../../../../app';
import { fetchRoles, fetchUser } from "../../../../../scripts/prisma-seed/fetch-records";
import { ROLES } from '../../../../role/role.constants';
import { UserDto } from '../../../dtos/user.dto';
import { RoleDto } from '../../../../role/dtos/role.dto';

let app: Express;
let cookies: string[];
let adminUser: UserDto;
let adminRoles: RoleDto[];

const urlPrefix = `/users/:id/roles`;

const createUser = async () => {
  const { body } = await request(app)
    .post('/users')
    .set('Cookie', cookies)
    .send({
      username: `new-user-${uuid()}`,
      password: 'abcde$12345',
    })
    .expect(201);
  return body;
};

describe('[ROLE_PERMISSIONS]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    adminUser = await fetchUser({username: ROLES.ADMIN.toLowerCase()});
    adminRoles = await fetchRoles({ name: ROLES.ADMIN });
    cookies = global.signin(adminUser.id);
  });

  describe(`GET ${urlPrefix}`, () => {
    it('should return a list', async () => {
      const response = await request(app)
        .get(urlPrefix.replace(':id', adminUser.id))
        .set('Cookie', cookies)
        .expect(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(urlPrefix.replace(':id', adminUser.id))
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(urlPrefix.replace(':id', adminUser.id))
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
        .post(urlPrefix.replace(':id', adminUser.id))
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
        .put(urlPrefix.replace(':id', adminUser.id))
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
        .patch(urlPrefix.replace(':id', adminUser.id))
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
        .delete(urlPrefix.replace(':id', adminUser.id))
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`GET ${urlPrefix}/:id`, () => {
    it('should return one record by ID', async () => {
      const role = adminRoles[0];
      const response = await request(app)
        .get(`${urlPrefix.replace(':id', adminUser.id)}/${role.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(role.id);
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', adminUser.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', adminUser.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', adminUser.id)}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`POST ${urlPrefix}/:id`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const role = adminRoles[0];
      const res = await request(app)
        .post(`${urlPrefix.replace(':id', adminUser.id)}/${role.id}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PUT ${urlPrefix}/:id`, () => {
    it('should create a new record', async () => {
      const role = adminRoles[0];
      const newUser = await createUser();
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', newUser.id)}/${role.id}`)
        .set('Cookie', cookies)
        .expect(201);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(role.id);
      expect(res.body.name).toBe(role.name);

      const { body: newPermission } = await request(app)
        .get(`${urlPrefix.replace(':id', newUser.id)}/${role.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(newPermission).toBeDefined();
      expect(newPermission.id).toBe(role.id);
    });

    it('should return Bad Request for existing record', async () => {
      const role = adminRoles[0];
      const newUser = await createUser();
      await request(app)
        .put(`${urlPrefix.replace(':id', newUser.id)}/${role.id}`)
        .set('Cookie', cookies)
        .expect(201);
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', newUser.id)}/${role.id}`)
        .set('Cookie', cookies)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Not Found for invalid ID', async () => {
      const newUser = await createUser();
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', newUser.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Not Found for invalid user ID', async () => {
      const role = adminRoles[0];
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', uuid())}/${role.id}`)
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

    it.todo('should update cached user permissions');

    it.todo('should NOT update cached user permissions on error response');

    it('should return Unauthorized for missing credentials', async () => {
      const role = adminRoles[0];
      const newUser = await createUser();
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', newUser.id)}/${role.id}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const role = adminRoles[0];
      const newUser = await createUser();
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .put(`${urlPrefix.replace(':id', newUser.id)}/${role.id}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PATCH ${urlPrefix}/:id`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const newUser = await createUser();
      const res = await request(app)
        .patch(`${urlPrefix.replace(':id', newUser.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`DELETE ${urlPrefix}/:id`, () => {
    it('should delete one record by ID', async () => {
      const role = adminRoles[0];
      const newUser = await createUser();
      await request(app)
        .put(`${urlPrefix.replace(':id', newUser.id)}/${role.id}`)
        .set('Cookie', cookies)
        .expect(201);
      await request(app)
        .delete(`${urlPrefix.replace(':id', newUser.id)}/${role.id}`)
        .set('Cookie', cookies)
        .expect(204);
      await request(app)
        .get(`${urlPrefix.replace(':id', newUser.id)}/${role.id}`)
        .set('Cookie', cookies)
        .expect(404);
    });

    it('should return Not Found for invalid ID', async () => {
      const newUser = await createUser();
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', newUser.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Not Found for invalid user ID', async () => {
      const role = adminRoles[0];
      const newUser = await createUser();
      await request(app)
        .put(`${urlPrefix.replace(':id', newUser.id)}/${role.id}`)
        .set('Cookie', cookies)
        .expect(201);
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', uuid())}/${role.id}`)
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

    it.todo('should update cached user permissions');

    it.todo('should NOT update cached user permissions on error response');

    it('should return Unauthorized for missing credentials', async () => {
      const newUser = await createUser();
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', newUser.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const newUser = await createUser();
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', newUser.id)}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });
});
