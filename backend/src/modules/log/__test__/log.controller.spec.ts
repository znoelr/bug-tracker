import { v4 as uuid } from 'uuid';
import { Pagination, QueryFilters, QueryOptions } from '../../../common/types';
import { fetchLog, fetchLogs, fetchUser } from '../../../scripts/prisma-seed/fetch-records';
import { ROLES } from '../../role/role.constants';
import logController from '../log.controller';
import { UserDto } from '../../user/dtos/user.dto';
import { logRepository } from '../log.repository';

let adminUser: UserDto;
let devUser: UserDto;
let cookies: string[];
let req: any = { body: {} };
let res: any = {
  json: jest.fn(),
  status: (_: number) => res,
  sendStatus: jest.fn(),
};
let next = jest.fn();

const sleep = (millis: number = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

const createLog = async () => {
  return await logRepository.create({
    id: uuid(),
    content: 'Mock create',
    triggeredById: devUser.id,
  });
};

describe('Log Controller', () => {
  beforeAll(async () => {
    adminUser = await fetchUser({ username: ROLES.ADMIN.toLowerCase() });
    devUser = await fetchUser({ username: ROLES.DEVELOPER.toLowerCase() });
    cookies = global.signin(adminUser.id);
  });

  beforeEach(() => {
    req = {
      body: {},
      pagination: new Pagination(),
      queryFilters: new QueryFilters(),
      queryOptions: new QueryOptions(),
      user: adminUser,
      foundRecord: undefined,
    };
    jest.resetAllMocks();
  });

  it('should create a log when calling "create" on any "controller"', async () => {
    const data = {
      id: uuid(),
      content: 'Mock create',
      triggeredById: devUser.id,
    };
    req.body = data;
    await logController.create({ endRequest: true }, req, res, next);
    await sleep(1_000);
    const [log] = await fetchLogs({ content: { contains: data.id } });
    expect(log).toBeDefined();
    expect(log.id).toBeDefined();
    expect(log.content.toLowerCase()).toContain('create');
    expect(log.content.toLowerCase()).toContain(data.id);
  });

  it('should create a log when calling "update" on any "controller"', async () => {
    const newLog = await createLog();
    req.body = { content: `Mock Updated content` };
    req.queryFilters = req.queryFilters.setWhere({ id: newLog.id });
    await logController.update({ endRequest: true }, req, res, next);
    await sleep(1_000);
    const [log] = await fetchLogs({ content: { contains: newLog.id } });
    expect(log.id).toBeDefined();
    expect(log.content.toLowerCase()).toContain('update');
    expect(log.content.toLowerCase()).toContain(newLog.id);
  });

  it('should create a log when calling "delete" on any "controller"', async () => {
    const newLog = await createLog();
    req.queryFilters = req.queryFilters.setWhere({ id: newLog.id });
    await logController.delete({ endRequest: true }, req, res, next);
    await sleep(1_000);
    const [log] = await fetchLogs({ content: { contains: newLog.id } });
    expect(log.id).toBeDefined();
    expect(log.content.toLowerCase()).toContain('delete');
    expect(log.content.toLowerCase()).toContain(newLog.id);
  });
});
