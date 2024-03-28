import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { bootstrapApp } from '../../../app';
import { fetchUser } from '../../../scripts/prisma-seed/fetch-records';
import { ROLES } from '../../role/role.constants';
import { UserDto } from '../dtos/user.dto';

let app: Express;
let adminUser: UserDto;
let cookies: string[];

const urlPrefix = '/users';

const createUser = async (): Promise<UserDto> => {
  const res = await request(app)
    .post(urlPrefix)
    .set('Cookie', cookies)
    .send({
      username: `${uuid()}@gmail.com`,
      password: 'abcde$12345',
    })
    .expect(201);
  return res.body;
};

describe('[USER]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    adminUser = await fetchUser({ username: ROLES.ADMIN.toLowerCase() });
    cookies = global.signin(adminUser.id);
  });

  describe(`GET ${urlPrefix}`, () => {
    it('should return a list', async () => {
      const res = await request(app)
        .get(urlPrefix)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every((u: UserDto) => !u.password)).toBe(true);
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
        username: `${uuid()}@gmail.com`,
        password: 'abcde$12345',
      };
      const {body: newUser} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newUser).toBeDefined();
      expect(newUser.id).toBeDefined();
      expect(newUser.username).toBe(data.username);
      expect(newUser.password).toBeUndefined();

      const res = await request(app)
        .get(`${urlPrefix}/${newUser.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newUser.id);
      expect(res.body.username).toBe(newUser.username);
    });
  
    it(`should return Bad Request for empty data`, async () => {
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send({})
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.username).toBeDefined();
      expect(res.body.errors.password).toBeDefined();
    });
  
    it(`should return Bad Request for missing "username"`, async () => {
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send({ password: 'abcde$12345' })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.username).toBeDefined();
      expect(res.body.errors.password).toBeUndefined();
    });
  
    it(`should return Bad Request for missing "password"`, async () => {
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send({ username: `${uuid()}@gmail.com` })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.username).toBeUndefined();
      expect(res.body.errors.password).toBeDefined();
    });
  
    it(`should return Bad Request for existing "username"`, async () => {
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send({
          username: adminUser.username,
          password: 'abcde$12345',
        })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('username');
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
      const res = await request(app)
        .get(`${urlPrefix}/${adminUser.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(adminUser.id);
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
    it('should update "password"', async () => {
      const data = {
        password: '12345$abcde',
        confirmPassword: '12345$abcde',
      };
      const newUser = await createUser();
      const {body: updatedUser} = await request(app)
        .patch(`${urlPrefix}/${newUser.id}`)
        .set('Cookie', cookies)
        .send(data)
        .expect(200);
      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(newUser.id);
      expect(updatedUser.username).toBe(newUser.username);
      expect(updatedUser.password).toBeUndefined();

      const res = await request(app)
        .get(`${urlPrefix}/${newUser.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedUser.id);
      expect(res.body.username).toBe(updatedUser.username);
      expect(res.body.password).toBeUndefined();
    });

    it('should NOT update "username"', async () => {
      const data = {
        username: `newusername-${uuid()}`,
        password: '12345$abcde',
        confirmPassword: '12345$abcde',
      };
      const newUser = await createUser();
      const {body: updatedUser} = await request(app)
        .patch(`${urlPrefix}/${newUser.id}`)
        .set('Cookie', cookies)
        .send(data)
        .expect(200);
      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(newUser.id);
      expect(updatedUser.username).toBe(newUser.username);
      expect(updatedUser.username).not.toBe(data.username);
      expect(updatedUser.password).toBeUndefined();

      const res = await request(app)
        .get(`${urlPrefix}/${newUser.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedUser.id);
      expect(res.body.username).toBe(newUser.username);
      expect(res.body.password).toBeUndefined();
    });

    it('should return Bad Request for missing "password"', async () => {
      const newUser = await createUser();
      const res = await request(app)
        .patch(`${urlPrefix}/${newUser.id}`)
        .set('Cookie', cookies)
        .send({ confirmPassword: '12345$abcde' })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.password).toBeDefined();
    });

    it('should return Bad Request for missing "confirmPassword"', async () => {
      const newUser = await createUser();
      const res = await request(app)
        .patch(`${urlPrefix}/${newUser.id}`)
        .set('Cookie', cookies)
        .send({ password: '12345$abcde' })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.confirmPassword).toBeDefined();
    });

    it('should return Bad Request for empty data', async () => {
      const newUser = await createUser();
      const res = await request(app)
        .patch(`${urlPrefix}/${newUser.id}`)
        .set('Cookie', cookies)
        .send({ })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.confirmPassword).toBeDefined();
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .patch(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
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
      const newUser = await createUser();
      await request(app)
        .delete(`${urlPrefix}/${newUser.id}`)
        .set('Cookie', cookies)
        .expect(204);
      await request(app)
        .get(`${urlPrefix}/${newUser.id}`)
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
