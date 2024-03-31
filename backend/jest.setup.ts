import jwt from 'jsonwebtoken';
import { Express } from 'express';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { ConfigService } from './src/config/config.service';
import { JWT_COOKIE_NAME } from './src/common/constants';
import { initInfrastructure } from './src/infrastructure';

beforeAll(async () => {
  await initInfrastructure();
})

global.signin = (userId: string): string[] => {
  const jwtPayload = { sub: userId };
  const accessToken = jwt.sign(jwtPayload, ConfigService.get<string>('JWT_SECRET'), {
    expiresIn: Number(ConfigService.get<number>('JWT_EXPIRES_IN_SECONDS') * 100),
  });
  const cookie = `${JWT_COOKIE_NAME}=${accessToken}`;
  return [ cookie ];
};

global.signinNewUser = async (cookies: string[], app: Express): Promise<string[]> => {
  const { body: newUser } = await request(app)
    .post('/users')
    .set('Cookie', cookies)
    .send({
      username: `New-user-${uuid()}`,
      password: 'abcde$12345',
    })
    .expect(201);
  return global.signin(newUser.id);
};
