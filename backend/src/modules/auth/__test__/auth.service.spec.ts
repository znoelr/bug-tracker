import { v4 as uuid } from 'uuid';
import { authService } from '../auth.service';
import { BadRequestException, UnauthorizedExeption } from '../../../common/exceptions';
import { userService } from '../../user/user.service';
import { QueryFilters } from '../../../common/types';
import { TokenBlacklistModel } from '../../token-blacklist/token-blacklist.schema';
import { hashStr } from '../../../common/helpers';

const createUser = async ({ username, password }: { username: string, password: string }) => {
  return await userService.create({
    id: uuid(),
    username,
    password: hashStr(password),
  });
};

describe('[Auth Service]', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create "access" and "refresh" tokens on login', async () => {
    const userData = {
      username: uuid(),
      password: 'abcde$12345',
    };
    await createUser(userData);
    const { accessToken, refreshToken } = await authService.login(userData.username, userData.password);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(accessToken).not.toBe(refreshToken);
  });

  it('should set "refresh" token to user', async () => {
    const userData = {
      username: uuid(),
      password: 'abcde$12345',
    };
    const newUser = await createUser(userData);
    expect(newUser.refreshToken).toBeNull();
    const { accessToken, refreshToken } = await authService.login(userData.username, userData.password);
    const foundUser = await userService.findOne(new QueryFilters().setWhere({ id: newUser.id }));
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(accessToken).not.toBe(refreshToken);
    expect(foundUser!.refreshToken).toBe(refreshToken);
  });

  it('should throw Bad Request for invalid "username"', async () => {
    const userData = {
      username: uuid(),
      password: 'abcde$12345',
    };
    await createUser(userData);
    await expect(authService.login(uuid(), userData.password)).rejects.toThrow(BadRequestException);
  });

  it('should throw Bad Request for invalid "password"', async () => {
    const userData = {
      username: uuid(),
      password: 'abcde$12345',
    };
    const newUser = await createUser(userData);
    await expect(authService.login(newUser.username, uuid())).rejects.toThrow(BadRequestException);
  });

  it('should blacklist tokens on logout', async () => {
    const userData = {
      username: uuid(),
      password: 'abcde$12345',
    };
    const newUser = await createUser(userData);
    const { accessToken, refreshToken } = await authService.login(newUser.username, userData.password);

    await authService.logout(newUser.id, accessToken, refreshToken);

    const foundAccessToken = await TokenBlacklistModel.findOne({ token: accessToken });
    expect(foundAccessToken!.token).toBe(accessToken);

    const foundRefreshToken = await TokenBlacklistModel.findOne({ token: refreshToken });
    expect(foundRefreshToken!.token).toBe(refreshToken);

    const foundUser = await userService.findOne(new QueryFilters().setWhere({ id: newUser.id }));
    expect(foundUser!.refreshToken).toBeNull();
  });

  it('should create a new "refresh" token', async () => {
    const userData = {
      username: uuid(),
      password: 'abcde$12345',
    };
    const newUser = await createUser(userData);
    const { accessToken, refreshToken } = await authService.login(newUser.username, userData.password);

    await userService.update({ refreshToken }, new QueryFilters().setWhere({ id: newUser.id }));

    const newRefreshToken = await authService.refreshToken(uuid(), refreshToken);
    expect(newRefreshToken).toBeDefined();
    expect(newRefreshToken).not.toBe(refreshToken);
  });

  it('should throw Unauthorized for blacklisted "refresh" token', async () => {
    const userData = {
      username: uuid(),
      password: 'abcde$12345',
    };
    const newUser = await createUser(userData);
    const { accessToken, refreshToken } = await authService.login(newUser.username, userData.password);

    await new TokenBlacklistModel({ token: refreshToken }).save();

    await expect(authService.refreshToken(uuid(), refreshToken)).rejects.toThrow(UnauthorizedExeption);
  });

  it('should throw Unauthorized for not found "refresh" token', async () => {
    const userData = {
      username: uuid(),
      password: 'abcde$12345',
    };
    const newUser = await createUser(userData);
    const { accessToken, refreshToken } = await authService.login(newUser.username, userData.password);

    await userService.update({ refreshToken: uuid() }, new QueryFilters().setWhere({ id: newUser.id }));

    await expect(authService.refreshToken(uuid(), refreshToken)).rejects.toThrow(UnauthorizedExeption);
  });
});
