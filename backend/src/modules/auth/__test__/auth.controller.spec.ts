import { v4 as uuid } from 'uuid';
import { JWT_COOKIE_NAME, JWT_REFRESH_COOKIE_NAME } from '../../../common/constants';
import authController from '../auth.controller';

jest.mock('../auth.service', () => {
  const originalModule = jest.requireActual('../auth.service');
  return {
    ...originalModule,
    authService: {
      login: (...args: any[]) => ({
        accessToken: uuid(),
        refreshToken: uuid(),
      }),
      logout: jest.fn(),
      refreshToken: jest.fn().mockImplementation((...args: any[]) => uuid()),
    },
  };
});

let req: any = {
  body: {},
};
let res: any = {
  status: (n: number) => res,
  cookie: jest.fn(),
  clearCookie: jest.fn(),
  json: jest.fn(),
  end: jest.fn(),
};
let next = jest.fn();

describe('[Auth Controller]', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set "access" and "refresh" cookies after login', async () => {
    req.body = {
      username: uuid(),
      password: 'abcde$12345',
    };
    await authController.login(req, res, next);
    expect(res.cookie.mock.calls[0][0]).toBe(JWT_COOKIE_NAME);
    expect(res.cookie.mock.calls[1][0]).toBe(JWT_REFRESH_COOKIE_NAME);
  });

  it('should clear "access" and "refresh" cookies after logout', async () => {
    req.user = { id: uuid() };
    req.cookies = {
      [JWT_COOKIE_NAME]: uuid(),
      [JWT_REFRESH_COOKIE_NAME]: uuid(),
    };
    await authController.logout(req, res, next);
    expect(res.clearCookie.mock.calls[0][0]).toBe(JWT_COOKIE_NAME);
    expect(res.clearCookie.mock.calls[1][0]).toBe(JWT_REFRESH_COOKIE_NAME);
  });

  it('should set "access" cookie after refresh token', async () => {
    req.user = { id: uuid() };
    req.cookies = {
      [JWT_COOKIE_NAME]: uuid(),
      [JWT_REFRESH_COOKIE_NAME]: uuid(),
    };
    await authController.refreshToken(req, res, next);
    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.cookie.mock.calls[0][0]).toBe(JWT_COOKIE_NAME);
  });
});
