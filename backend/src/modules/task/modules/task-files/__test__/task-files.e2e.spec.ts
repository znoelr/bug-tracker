import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { TASK_PRIORITY, TASK_STATUS, TASK_TYPES } from '../../../task.constants';
import { ROLES } from '../../../../role/role.constants';
import { bootstrapApp } from '../../../../../app';
import { fetchProjects, fetchUser } from '../../../../../scripts/prisma-seed/fetch-records';
import { UserDto } from '../../../../user/dtos/user.dto';
import { ProjectDto } from '../../../../project/dtos/project.dto';
import { TaskDto } from '../../../dtos/task.dto';
import { FileDto } from '../../../../file/dtos/file.dto';

let app: Express;
let cookies: string[];
let projects: ProjectDto[];
let adminUser: UserDto;
let testTask: TaskDto;
let testTaskFiles: FileDto[];

const urlPrefix = '/tasks/:id/files';

const createTask = async () => {
  const res = await request(app)
    .post('/tasks')
    .set('Cookie', cookies)
    .send({
      title: `Random task ${uuid()}`,
      description: "Some data for description",
      type: TASK_TYPES.FEATURE,
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.NORMAL,
      assigneeId: adminUser.id,
      projectId: projects[0].id,
    })
    .expect(201);
  return res.body;
};

const createTaskFiles = async (taskId: string, count: number = 3) => {
  const promises = new Array(count).fill(null).map(async () => await request(app)
    .post(urlPrefix.replace(':id', taskId))
    .set('Cookie', cookies)
    .send({
      name: `Some file ${uuid()}`,
      mimetype: faker.system.mimeType(),
      url: faker.internet.url(),
    })
    .expect(201));
  const responses = await Promise.all(promises);
  return responses.map(res => res.body);
};

describe('[TASK_FILES]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    projects = await fetchProjects();
    adminUser = await fetchUser({username: ROLES.ADMIN.toLowerCase()});
    cookies = await global.signin(adminUser.id);
    testTask = await createTask();
    testTaskFiles = await createTaskFiles(testTask.id);
  });

  describe(`GET ${urlPrefix}`, () => {
    it('should return a list', async () => {
      const res = await request(app)
        .get(urlPrefix.replace(':id', testTask.id))
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every((f: FileDto) => !!f.id)).toBe(true);
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(urlPrefix.replace(':id', testTask.id))
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(urlPrefix.replace(':id', testTask.id))
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
        name: `Some file ${uuid()}`,
        mimetype: faker.system.mimeType(),
        url: faker.internet.url(),
      };
      const {body: newTaskFile} = await request(app)
        .post(urlPrefix.replace(':id', testTask.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTaskFile.id).toBeDefined();
      expect(newTaskFile.name).toBe(data.name);
      expect(newTaskFile.mimetype).toBe(data.mimetype);
      expect(newTaskFile.url).toBe(data.url);

      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id)}/${newTaskFile.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTaskFile.id);
      expect(res.body.name).toBe(newTaskFile.name);
      expect(res.body.mimetype).toBe(newTaskFile.mimetype);
      expect(res.body.url).toBe(newTaskFile.url);
    });

    it('should return Bad Request for empty data', async () => {
      const res = await request(app)
        .post(urlPrefix.replace(':id', testTask.id))
        .set('Cookie', cookies)
        .send({})
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.name).toBeDefined();
      expect(res.body.errors.mimetype).toBeDefined();
      expect(res.body.errors.url).toBeDefined();
    });

    it('should return Bad Request for missing "name"', async () => {
      const data = {
        mimetype: faker.system.mimeType(),
        url: faker.internet.url(),
      };
      const res = await request(app)
        .post(urlPrefix.replace(':id', testTask.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.name).toBeDefined();
      expect(res.body.errors.mimetype).toBeUndefined();
      expect(res.body.errors.url).toBeUndefined();
    });

    it('should return Bad Request for missing "mimetype"', async () => {
      const data = {
        name: `Some name ${uuid()}`,
        url: faker.internet.url(),
      };
      const res = await request(app)
        .post(urlPrefix.replace(':id', testTask.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.name).toBeUndefined();
      expect(res.body.errors.mimetype).toBeDefined();
      expect(res.body.errors.url).toBeUndefined();
    });

    it('should return Bad Request for invalid "mimetype"', async () => {
      const data = {
        name: `Some name ${uuid()}`,
        mimetype: 'Invalid mimetype',
        url: faker.internet.url(),
      };
      const res = await request(app)
        .post(urlPrefix.replace(':id', testTask.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.name).toBeUndefined();
      expect(res.body.errors.mimetype).toBeDefined();
      expect(res.body.errors.url).toBeUndefined();
    });

    it('should return Bad Request for missing "url"', async () => {
      const data = {
        name: `Some name ${uuid()}`,
        mimetype: faker.system.mimeType(),
      };
      const res = await request(app)
        .post(urlPrefix.replace(':id', testTask.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.name).toBeUndefined();
      expect(res.body.errors.mimetype).toBeUndefined();
      expect(res.body.errors.url).toBeDefined();
    });

    it('should return Bad Request for invalid "url"', async () => {
      const data = {
        name: `Some name ${uuid()}`,
        mimetype: faker.system.mimeType(),
        url: 'Invalid url',
      };
      const res = await request(app)
        .post(urlPrefix.replace(':id', testTask.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.name).toBeUndefined();
      expect(res.body.errors.mimetype).toBeUndefined();
      expect(res.body.errors.url).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .post(urlPrefix.replace(':id', testTask.id))
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .post(urlPrefix.replace(':id', testTask.id))
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
        .put(urlPrefix.replace(':id', testTask.id))
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
        .patch(urlPrefix.replace(':id', testTask.id))
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
        .delete(urlPrefix.replace(':id', testTask.id))
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`GET ${urlPrefix}/:id`, () => {
    it('should return one record by ID', async () => {
      const task = testTask;
      const taskFile = testTaskFiles[0];
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', task.id)}/${taskFile.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(taskFile.id);
      expect(res.body.name).toBe(taskFile.name);
      expect(res.body.mimetype).toBe(taskFile.mimetype);
      expect(res.body.url).toBe(taskFile.url);
    });
  
    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id)}/${uuid()}`)
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
        .post(`${urlPrefix.replace(':id', testTask.id)}/${uuid()}`)
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
        .put(`${urlPrefix.replace(':id', testTask.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PATCH ${urlPrefix}/:id`, () => {
    it('should return Not Found for unimplemented method', async () => {
      const res = await request(app)
        .patch(`${urlPrefix.replace(':id', testTask.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`DELETE ${urlPrefix}/:id`, () => {
    it('should delete one record by ID', async () => {
      const [newTaskFile] = await createTaskFiles(testTask.id, 1);
      await request(app)
        .delete(`${urlPrefix.replace(':id', testTask.id)}/${newTaskFile.id}`)
        .set('Cookie', cookies)
        .expect(204);
      await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id)}/${newTaskFile.id}`)
        .set('Cookie', cookies)
        .expect(404);
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', testTask.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', testTask.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', testTask.id)}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });
});
