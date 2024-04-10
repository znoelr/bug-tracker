import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { ROLES } from '../../../../../../role/role.constants';
import { bootstrapApp } from '../../../../../../../app';
import { fetchTasks, fetchUser } from '../../../../../../../scripts/prisma-seed/fetch-records';
import { UserDto } from '../../../../../../user/dtos/user.dto';
import { FileDto } from '../../../../../../file/dtos/file.dto';
import { TaskCommentDto } from '../../../dtos/task-comment.dto';
import { TaskDto } from '../../../../../dtos/task.dto';

let app: Express;
let cookies: string[];
let adminUser: UserDto;
let managerUser: UserDto;
let testTask: TaskDto;
let testTaskComment: TaskCommentDto;
let testTaskCommentFiles: FileDto[];

let urlPrefix = '/tasks/:id/comments/:commentId/files';

const createTaskComment = async (taskId: string) => {
  const res = await request(app)
    .post(`/tasks/${taskId}/comments`)
    .set('Cookie', cookies)
    .send({
      content: `New task comment name ${uuid()}`,
    })
    .expect(201);
  return res.body;
};

const createTaskCommentFiles = async (taskCommentId: string, count: number = 3) => {
  const promises = new Array(count).fill(null).map(async () => await request(app)
    .post(urlPrefix.replace(':id', testTask.id).replace(':commentId', taskCommentId))
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

describe('[TASK_COMMENT_FILES]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    adminUser = await fetchUser({username: ROLES.ADMIN.toLowerCase()});
    managerUser = await fetchUser({username: ROLES.MANAGER.toLowerCase()});
    cookies = await global.signin(adminUser.id);
    const tasks = await fetchTasks();
    testTask = tasks[0];
    testTaskComment = await createTaskComment(testTask.id);
    testTaskCommentFiles = await createTaskCommentFiles(testTaskComment.id);
  });

  describe(`GET ${urlPrefix}`, () => {
    it('should return a list', async () => {
      const res = await request(app)
        .get(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every((f: FileDto) => !!f.id)).toBe(true);
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
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
      const {body: newTaskCommentFile} = await request(app)
        .post(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTaskCommentFile.id).toBeDefined();
      expect(newTaskCommentFile.name).toBe(data.name);
      expect(newTaskCommentFile.mimetype).toBe(data.mimetype);
      expect(newTaskCommentFile.url).toBe(data.url);

      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${newTaskCommentFile.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTaskCommentFile.id);
      expect(res.body.name).toBe(newTaskCommentFile.name);
      expect(res.body.mimetype).toBe(newTaskCommentFile.mimetype);
      expect(res.body.url).toBe(newTaskCommentFile.url);
    });

    it('should return Bad Request for empty data', async () => {
      const res = await request(app)
        .post(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
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
        .post(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
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
        .post(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
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
        .post(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
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
        .post(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
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
        .post(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
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
        .post(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .post(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
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
        .put(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
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
        .patch(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
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
        .delete(urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id))
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`GET ${urlPrefix}/:id`, () => {
    it('should return one record by ID', async () => {
      const taskComment = testTaskComment;
      const taskCommentFile = testTaskCommentFiles[0];
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', taskComment.id)}/${taskCommentFile.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(taskCommentFile.id);
      expect(res.body.name).toBe(taskCommentFile.name);
      expect(res.body.mimetype).toBe(taskCommentFile.mimetype);
      expect(res.body.url).toBe(taskCommentFile.url);
    });
  
    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${uuid()}`)
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
        .post(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${uuid()}`)
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
        .put(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${uuid()}`)
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
        .patch(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`DELETE ${urlPrefix}/:id`, () => {
    it('should delete one record by ID', async () => {
      const [newTaskCommentFile] = await createTaskCommentFiles(testTaskComment.id, 1);
      await request(app)
        .delete(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${newTaskCommentFile.id}`)
        .set('Cookie', cookies)
        .expect(204);
      await request(app)
        .get(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${newTaskCommentFile.id}`)
        .set('Cookie', cookies)
        .expect(404);
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', testTask.id).replace(':commentId', testTaskComment.id)}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });
});
