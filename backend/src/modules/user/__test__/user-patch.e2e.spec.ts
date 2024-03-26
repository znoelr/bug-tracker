import request from 'supertest';
import { Express } from "express";
import { v4 as uuid } from 'uuid';
import { UserDto } from "../dtos/user.dto";
import { bootstrapApp } from "../../../app";
import { fetchUser } from "../../../scripts/prisma-seed/fetch-records";
import { ROLES } from "../../role/role.constants";

// To bypass "Exclude"d fields
jest.mock('../dtos/user.dto', () => ({}));

let app: Express;
let adminUser: UserDto;
let cookies: string[];

const createUser = async (): Promise<UserDto> => {
  const res = await request(app)
    .post('/users')
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
  describe('PATCH /user/:id', () => {
    it('should update a user password', async () => {      
      const data = {
        password: '12345$abcde',
        confirmPassword: '12345$abcde',
      };
      const newUser = await createUser();
      const res = await request(app)
        .patch(`/users/${newUser.id}`)
        .set('Cookie', cookies)
        .send(data)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(newUser.id);
      expect(res.body.username).toBe(newUser.username);
      expect(res.body.password).toBeDefined();
      expect(res.body.password).not.toBe(newUser.password);

      const resNewUser = await request(app)
        .get(`/users/${newUser.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(resNewUser.body).toBeDefined();
      expect(resNewUser.body.id).toBe(newUser.id);
      expect(resNewUser.body.password).toBe(res.body.password);
    });
  });
});
