import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { bootstrapApp } from '../../../app';
import { UserDto } from '../../user/dtos/user.dto';
import { ROLES } from '../../role/role.constants';
import { fetchUser } from '../../../scripts/prisma-seed/fetch-records';
import { JWT_COOKIE_NAME } from '../../../common/constants';

let app: Express;
let adminUser: UserDto;
let cookies: string[];

const sleep = async (millis: number) => new Promise((resolve) => setTimeout(resolve, millis))

const createUser = async ({ username, password }: { username: string, password: string }) => {
  const res = await request(app)
    .post('/users')
    .set('Cookie', cookies)
    .send({
      username,
      password,
    })
    .expect(201);
  return res.body;
};

describe('[AUTH]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    adminUser = await fetchUser({ username: ROLES.ADMIN.toLowerCase() });
    cookies = await global.signin(adminUser.id);
  });

  describe('login', () => {
    it('should login a user', async () => {
      const data = {
        username: `${uuid()}`,
        password: 'abcde$12345',
      };
      await createUser(data);
      await request(app)
        .post('/auth/login')
        .send(data)
        .expect(200);
    });

    it('should return Bad Request for misisng "username"', async () => {
      const data = {
        username: `${uuid()}`,
        password: 'abcde$12345',
      };
      await createUser(data);
      const res = await request(app)
        .post('/auth/login')
        .send({ password: data.password })
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.username).toBeDefined();
    });

    it('should return Bad Request for misisng "password"', async () => {
      const data = {
        username: `${uuid()}`,
        password: 'abcde$12345',
      };
      await createUser(data);
      const res = await request(app)
        .post('/auth/login')
        .send({ username: data.username })
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.password).toBeDefined();
    });

    it('should return Bad Request for empty data', async () => {
      const data = {
        username: `${uuid()}`,
        password: 'abcde$12345',
      };
      await createUser(data);
      const res = await request(app)
        .post('/auth/login')
        .send({ })
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.username).toBeDefined();
      expect(res.body.errors.password).toBeDefined();
    });

    it('should return Bad Request invalid "username"', async () => {
      const data = {
        username: `${uuid()}`,
        password: 'abcde$12345',
      };
      await createUser(data);
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: uuid(),
          password: data.password,
        })
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('credentials');
    });

    it('should return Bad Request invalid "password"', async () => {
      const data = {
        username: `${uuid()}`,
        password: 'abcde$12345',
      };
      await createUser(data);
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: data.username,
          password: uuid(),
        })
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('credentials');
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      const loginCookies = await global.signinNewUser(cookies, app);
      await request(app)
        .get('/tasks')
        .set('Cookie', loginCookies)
        .expect(403);
      await request(app)
        .get('/auth/logout')
        .set('Cookie', loginCookies)
        .expect(204);
      await request(app)
        .get('/tasks')
        .set('Cookie', loginCookies)
        .expect(401);
    });

    it('should return Unauthorized for invalid cookies', async () => {
      const loginCookies = await global.signinNewUser(cookies, app);
      await request(app)
        .get('/auth/logout')
        .set('Cookie', loginCookies)
        .expect(204);
      await request(app)
        .get('/auth/logout')
        .set('Cookie', loginCookies)
        .expect(401);
    });
  });

  describe('refresh', () => {
    it('should create a new access token', async () => {
      const userData = {
        username: uuid(),
        password: 'abcde$12345',
      };
      await createUser(userData);
      const resLogin = await request(app)
        .post('/auth/login')
        .send(userData)
        .expect(200);
      const loginCookies: any = resLogin.headers['set-cookie'];
      await sleep(1000);
      const res = await request(app)
        .get('/auth/refresh')
        .set('Cookie', loginCookies)
        .expect(200);
      expect(res.body.accessToken).toBeDefined();
      const newCookies = loginCookies.map((cookie: string) => {
        if (cookie.startsWith(`${JWT_COOKIE_NAME}=`)) {
          return (res.headers['set-cookie'] as any)
            .find((cookie: string) => cookie.startsWith(`${JWT_COOKIE_NAME}=`));
        }
        return cookie;
      });
      await sleep(1000);
      const res2 = await request(app)
        .get('/auth/refresh')
        .set('Cookie', newCookies)
        .expect(200);
      expect(res2.body.accessToken).toBeDefined();

      expect(res.body.accessToken).not.toBe(res2.body.accessToken);
    });

    it('should return Unauthorized for invalid refresh cookie', async () => {
      const userData = {
        username: uuid(),
        password: 'abcde$12345',
      };
      await createUser(userData);
      const resLogin = await request(app)
        .post('/auth/login')
        .send(userData)
        .expect(200);
      const loginCookies = (resLogin.headers['set-cookie'] as any).filter(
        (cookie: string) => cookie.startsWith(`${JWT_COOKIE_NAME}=`)
      );
      await request(app)
        .get('/auth/refresh')
        .set('Cookie', loginCookies)
        .expect(401);
    });
  });
});
