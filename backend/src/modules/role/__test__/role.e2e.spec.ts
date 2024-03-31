import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { bootstrapApp } from '../../../app';
import { fetchRoles, fetchUser } from '../../../scripts/prisma-seed/fetch-records';
import { ROLES } from '../role.constants';
import { UserDto } from '../../user/dtos/user.dto';
import { RoleDto } from '../dtos/role.dto';

let app: Express;
let adminUser: UserDto;
let cookies: string[];
let roles: RoleDto[];

const urlPrefix = '/roles';

const createRole = async (): Promise<RoleDto> => {
  const res = await request(app)
    .post(urlPrefix)
    .set('Cookie', cookies)
    .send({
      name: `New Role - ${uuid()}`,
      description: 'Some description',
    })
    .expect(201);
  return res.body;
}

describe('[ROLE]', () => {
  beforeAll(async() => {
    app = await bootstrapApp();
    adminUser = await fetchUser({ username: ROLES.ADMIN.toLowerCase() })
    roles = await fetchRoles();
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

    it('should return Unauthorized for missing credentials', async () => {
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
    it('should create a new record', async () => {
      const data = {
        name: `New Role - ${uuid()}`,
        description: 'Some descrition',
      };
      const {body: newRole} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newRole).toBeDefined();
      expect(newRole.id).toBeDefined();
      expect(newRole.name).toBe(data.name);
      expect(newRole.description).toBe(data.description);

      const res = await request(app)
        .get(`${urlPrefix}/${newRole.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(newRole.id);
      expect(res.body.name).toBe(newRole.name);
      expect(res.body.description).toBe(newRole.description);
    });

    it('should create a new record without "description"', async () => {
      const data = { name: `New Role - ${uuid()}` };
      const {body: newRole} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newRole).toBeDefined();
      expect(newRole.id).toBeDefined();
      expect(newRole.name).toBe(data.name);
      expect(newRole.description).toBeFalsy();

      const res = await request(app)
        .get(`${urlPrefix}/${newRole.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(newRole.id);
      expect(res.body.name).toBe(newRole.name);
      expect(res.body.description).toBe(newRole.description);
    });

    it('should return Bad Request for empty data', async () => {
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send({})
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.name).toBeDefined();
    });

    it('should return Bad Request for mising "name"', async () => {
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send({ description: 'SOme description' })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.name).toBeDefined();
    });

    it('should return Bad Request for existing "name"', async () => {
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send({ name: ROLES.DEVELOPER })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('name');
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .post(urlPrefix)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', newUserCookies)
        .expect(403);
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
      const role = roles[0];
      const res = await request(app)
        .get(`${urlPrefix}/${role.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(role.id);
    });
  
    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
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

  describe(`PATCH ${urlPrefix}/:id`, () => {
    it('should update "name"', async () => {
      const testRole = await createRole();
      const newName = `Updated role name - ${uuid()}`;
      const {body: updatedRole} = await request(app)
        .patch(`${urlPrefix}/${testRole.id}`)
        .set('Cookie', cookies)
        .send({ name: newName })
        .expect(200);
      expect(updatedRole).toBeDefined();
      expect(updatedRole.id).toBe(testRole.id);
      expect(updatedRole.name).toBe(newName);
      expect(updatedRole.name).not.toBe(testRole.name);
      expect(updatedRole.description).toBe(testRole.description);

      const res = await request(app)
        .get(`${urlPrefix}/${testRole.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedRole.id);
      expect(res.body.name).toBe(updatedRole.name);
      expect(res.body.description).toBe(updatedRole.description);
    });

    it('should update "description"', async () => {
      const testRole = await createRole();
      const newDescription = `Updated role description - ${uuid()}`;
      const {body: updatedRole} = await request(app)
        .patch(`${urlPrefix}/${testRole.id}`)
        .set('Cookie', cookies)
        .send({ description: newDescription })
        .expect(200);
      expect(updatedRole).toBeDefined();
      expect(updatedRole.id).toBe(testRole.id);
      expect(updatedRole.name).toBe(testRole.name);
      expect(updatedRole.description).toBe(newDescription);
      expect(updatedRole.description).not.toBe(testRole.description);

      const res = await request(app)
        .get(`${urlPrefix}/${testRole.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedRole.id);
      expect(res.body.name).toBe(updatedRole.name);
      expect(res.body.description).toBe(updatedRole.description);
    });

    it('should return Bad Request for existing "name"', async () => {
      const testRole = await createRole();
      const res = await request(app)
        .patch(`${urlPrefix}/${testRole.id}`)
        .set('Cookie', cookies)
        .send({ name: ROLES.ADMIN })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Bad Request for empty data', async () => {
      const testRole = await createRole();
      const res = await request(app)
        .patch(`${urlPrefix}/${testRole.id}`)
        .set('Cookie', cookies)
        .send({ })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .patch(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .send({ name: 'Some random name' })
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .patch(`${urlPrefix}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .patch(`${urlPrefix}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`DELETE ${urlPrefix}/:id`, () => {
    it('should delete one record by ID', async () => {
      const testRole = await createRole();
      await request(app)
        .delete(`${urlPrefix}/${testRole.id}`)
        .set('Cookie', cookies)
        .expect(204);
      await request(app)
        .get(`${urlPrefix}/${testRole.id}`)
        .set('Cookie', cookies)
        .expect(404);
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .delete(`${urlPrefix}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });
});
