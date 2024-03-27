import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
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

const urlPrefix = '/permissions';

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

  describe(`GET ${urlPrefix}`, () => {
    it('should return a list', async () => {
      const res = await request(app)
        .get(urlPrefix)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return Unauthenticated for missing credentials', async () => {
      const res = await request(app)
        .get(urlPrefix)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(urlPrefix)
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
        .post(urlPrefix)
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
        .put(urlPrefix)
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
        .patch(urlPrefix)
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
        .delete(urlPrefix)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`GET ${urlPrefix}/:id`, () => {
    it('should return one record by ID', async () => {
      const permission = permissions[0];
      const res = await request(app)
        .get(`${urlPrefix}/${permission.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(permission.id);
      expect(res.body.name).toBe(permission.name);
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/${Date.now()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthenticated for missing credentials', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(`${urlPrefix}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`POST ${urlPrefix}/:id`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PATCH ${urlPrefix}/:id`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const res = await request(app)
        .patch(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PUT ${urlPrefix}/:id`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`DELETE ${urlPrefix}/:id`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });
});
