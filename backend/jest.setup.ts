import jwt from 'jsonwebtoken';
import { fetchRecords } from './src/scripts/prisma-seed/fetch-records';
import { ConfigService } from './src/config/config.service';
import { JWT_COOKIE_NAME } from './src/modules/common/constants';


beforeAll(async () => {
  global.records = await fetchRecords();
});

global.signin = (userId: string): string[] => {
  const jwtPayload = { sub: userId };
  const accessToken = jwt.sign(jwtPayload, ConfigService.get<string>('JWT_SECRET'), {
    expiresIn: Number(ConfigService.get<number>('JWT_EXPIRES_IN_SECONDS') * 10),
  });
  const cookie = `${JWT_COOKIE_NAME}=${accessToken}`;
  return [ cookie ];
};
