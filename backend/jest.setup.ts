import jwt from 'jsonwebtoken';
import { ConfigService } from './src/config/config.service';
import { JWT_COOKIE_NAME } from './src/modules/common/constants';


global.signin = (userId: string): string[] => {
  const jwtPayload = { sub: userId };
  const accessToken = jwt.sign(jwtPayload, ConfigService.get<string>('JWT_SECRET'), {
    expiresIn: Number(ConfigService.get<number>('JWT_EXPIRES_IN_SECONDS') * 10),
  });
  const cookie = `${JWT_COOKIE_NAME}=${accessToken}`;
  return [ cookie ];
};
