import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { ROLES } from '../../../../role/role.constants';
import { bootstrapApp } from '../../../../../app';
import { TASK_PRIORITY, TASK_STATUS, TASK_TYPES } from '../../../task.constants';
import { fetchProjects, fetchTasks, fetchUser } from '../../../../../scripts/prisma-seed/fetch-records';
import { TaskDto } from '../../../dtos/task.dto';
import { UserDto } from '../../../../user/dtos/user.dto';
import { ProjectDto } from '../../../../project/dtos/project.dto';

let app: Express;
let cookies: string[];
let tasks: TaskDto[];
let projects: ProjectDto[];
let taskTest: TaskDto;
let devUser: UserDto;

const urlPrefix = '/tasks/:id/comments';

const createUser = async () => {
  const res = await request(app)
    .post('/users')
    .set('Cookie', cookies)
    .send({
      username: `newuser${uuid()}@gmail.com`,
      password: `abcde$12345`,
    })
    .expect(201);
  return res.body;
};

const createTask = async (userId?: string, projectId?: string) => {
  const assigneeId = userId || devUser.id;
  const projId = projectId || projects[0].id;
  const res = await request(app)
    .post('/tasks')
    .set('Cookie', cookies)
    .send({
      title: `Random task ${uuid()}`,
      description: "Some data for description",
      type: TASK_TYPES.FEATURE,
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.NORMAL,
      projectId: projId,
      assigneeId,
    })
    .expect(201);
  return res.body;
};

const createTaskComment = async (taskId: string, ) => {
  const res = await request(app)
    .post(urlPrefix.replace(':id', taskId))
    .set('Cookie', cookies)
    .send({
      content: `Comment content ${uuid()}`,
      createdById: devUser.id,
    })
    .expect(201);
  return res.body;
};

describe('[TASK_COMMENTS]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    const adminUser = await fetchUser({username: ROLES.ADMIN.toLowerCase()});
    tasks = await fetchTasks();
    projects = await fetchProjects();
    devUser = await fetchUser({username: ROLES.DEVELOPER.toLowerCase()});
    cookies = await global.signin(adminUser.id);
    taskTest = await createTask(devUser.id, projects[0].id);
  });

  describe(`GET ${urlPrefix}`, () => {
    it('should return a list', async () => {
      const task = tasks[0];
      const res = await request(app)
        .get(urlPrefix.replace(':id', task.id))
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(urlPrefix.replace(':id', taskTest.id))
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(urlPrefix.replace(':id', taskTest.id))
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`POST ${urlPrefix}`, () => {
    it('should create a new record', async () => {
      const task = taskTest;
      const data = {
        content: `Random comment ${uuid()}`,
        createdById: devUser.id,
      };
      const {body: newTaskComment} = await request(app)
        .post(urlPrefix.replace(':id', task.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTaskComment).toBeDefined();
      expect(newTaskComment.id).toBeDefined();
      expect(newTaskComment.content).toBe(data.content);
      expect(newTaskComment.taskId).toBe(task.id);
      expect(newTaskComment.createdById).toBe(data.createdById);

      const res = await request(app)
        .get(`${urlPrefix.replace(':id', task.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTaskComment.id);
      expect(res.body.content).toBe(newTaskComment.content);
      expect(res.body.taskId).toBe(newTaskComment.taskId);
      expect(res.body.createdById).toBe(newTaskComment.createdById);
    });

    it('should set "taskId"', async () => {
      const task = taskTest;
      const data = {
        content: `Random comment ${uuid()}`,
        createdById: devUser.id,
      };
      const {body: newTaskComment} = await request(app)
        .post(urlPrefix.replace(':id', task.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTaskComment).toBeDefined();
      expect(newTaskComment.id).toBeDefined();
      expect(newTaskComment.content).toBe(data.content);
      expect(newTaskComment.taskId).toBe(task.id);
      expect(newTaskComment.createdById).toBe(data.createdById);

      const res = await request(app)
        .get(`${urlPrefix.replace(':id', task.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTaskComment.id);
      expect(res.body.content).toBe(newTaskComment.content);
      expect(res.body.taskId).toBe(newTaskComment.taskId);
      expect(res.body.createdById).toBe(newTaskComment.createdById);
    });

    it(`shouldn't override "taskId"`, async () => {
      const task = tasks[0];
      const data = {
        content: `Random comment ${uuid()}`,
        taskId: taskTest.id,
        createdById: devUser.id,
      };
      const {body: newTaskComment} = await request(app)
        .post(urlPrefix.replace(':id', task.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTaskComment).toBeDefined();
      expect(newTaskComment.id).toBeDefined();
      expect(newTaskComment.content).toBe(data.content);
      expect(newTaskComment.taskId).toBe(task.id);
      expect(newTaskComment.taskId).not.toBe(data.taskId);
      expect(newTaskComment.createdById).toBe(data.createdById);

      const res = await request(app)
        .get(`${urlPrefix.replace(':id', task.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTaskComment.id);
      expect(res.body.content).toBe(newTaskComment.content);
      expect(res.body.taskId).toBe(newTaskComment.taskId);
      expect(res.body.createdById).toBe(newTaskComment.createdById);
    });

    it('should return Bad Request for empty data', async () => {
      const res = await request(app)
        .post(urlPrefix.replace(':id', taskTest.id))
        .set('Cookie', cookies)
        .send({})
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.content).toBeDefined();
      expect(res.body.errors.createdById).toBeDefined();
    });

    it('should return Bad Request for mising "content"', async () => {
      const data = {
        createdById: devUser.id,
      };
      const res = await request(app)
        .post(urlPrefix.replace(':id', taskTest.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.content).toBeDefined();
      expect(res.body.errors.createdById).toBeUndefined();
    });

    it('should return Bad Request for mising "createdById"', async () => {
      const data = {
        content: `Random content ${uuid()}`,
      };
      const res = await request(app)
        .post(urlPrefix.replace(':id', taskTest.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.content).toBeUndefined();
      expect(res.body.errors.createdById).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .post(urlPrefix.replace(':id', taskTest.id))
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .post(urlPrefix.replace(':id', taskTest.id))
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
        .put(urlPrefix.replace(':id', taskTest.id))
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
        .patch(urlPrefix.replace(':id', taskTest.id))
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
        .delete(urlPrefix.replace(':id', taskTest.id))
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`GET ${urlPrefix}/:id`, () => {
    it('should return one record by ID', async () => {
      const newTaskComment = await createTaskComment(taskTest.id);
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', taskTest.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(newTaskComment.id);
      expect(res.body.content).toBe(newTaskComment.content);
      expect(res.body.taskId).toBe(newTaskComment.taskId);
      expect(res.body.createdById).toBe(newTaskComment.createdById);
    });
  
    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
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
        .post(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
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
        .put(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PATCH ${urlPrefix}/:id`, () => {
    it('should update "content"', async () => {
      const newTaskComment = await createTaskComment(taskTest.id);
      const newContent = `Up New content ${uuid()}`;
      const {body: updatedTaskComment} = await request(app)
        .patch(`${urlPrefix.replace(':id', taskTest.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .send({ content: newContent })
        .expect(200);
      expect(updatedTaskComment.id).toBe(newTaskComment.id);
      expect(updatedTaskComment.content).toBe(newContent);
      expect(updatedTaskComment.content).not.toBe(newTaskComment.content);

      const res = await request(app)
        .get(`${urlPrefix.replace(':id', taskTest.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedTaskComment.id);
      expect(res.body.content).toBe(updatedTaskComment.content);
      expect(res.body.taskId).toBe(newTaskComment.taskId);
      expect(res.body.createdById).toBe(newTaskComment.createdById);
    });

    it(`shouldn't update "taskId"`, async () => {
      const newTaskComment = await createTaskComment(taskTest.id);
      const newTask = await createTask();
      const newTaskId = newTask.id;
      const {body: updatedTaskComment} = await request(app)
        .patch(`${urlPrefix.replace(':id', taskTest.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .send({
          content: 'Updated content',
          taskId: newTaskId,
        })
        .expect(200);
      expect(updatedTaskComment.id).toBe(newTaskComment.id);
      expect(updatedTaskComment.taskId).toBe(newTaskComment.taskId);
      expect(updatedTaskComment.taskId).not.toBe(newTaskId);

      const res = await request(app)
        .get(`${urlPrefix.replace(':id', taskTest.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedTaskComment.id);
      expect(res.body.content).toBe(updatedTaskComment.content);
      expect(res.body.taskId).toBe(newTaskComment.taskId);
      expect(res.body.createdById).toBe(newTaskComment.createdById);
    });

    it('should return Bad Request for missing "content"', async () => {
      const newTaskComment = await createTaskComment(taskTest.id);
      const newUser = await createUser();
      const newTask = await createTask();
      const newTaskId = newTask.id;
      const newCreatedById = newUser.id;
      const res = await request(app)
        .patch(`${urlPrefix.replace(':id', taskTest.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .send({
          taskId: newTaskId,
          createdById: newCreatedById,
        })
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.content).toBeDefined();

      const res2 = await request(app)
        .get(`${urlPrefix.replace(':id', taskTest.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res2.body.id).toBe(newTaskComment.id);
      expect(res2.body.content).toBe(newTaskComment.content);
      expect(res2.body.taskId).toBe(newTaskComment.taskId);
      expect(res2.body.taskId).not.toBe(newTaskId);
      expect(res2.body.createdById).toBe(newTaskComment.createdById);
      expect(res2.body.createdById).not.toBe(newCreatedById);
    });

    it(`shouldn't update "createdById"`, async () => {
      const newTaskComment = await createTaskComment(taskTest.id);
      const newUser = await createUser();
      const newCreatedById = newUser.id;
      const {body: updatedTaskComment} = await request(app)
        .patch(`${urlPrefix.replace(':id', taskTest.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .send({
          content: 'Updated content',
          createdById: newCreatedById,
        })
        .expect(200);
      expect(updatedTaskComment.id).toBe(newTaskComment.id);
      expect(updatedTaskComment.createdById).toBe(newTaskComment.createdById);
      expect(updatedTaskComment.createdById).not.toBe(newCreatedById);

      const res = await request(app)
        .get(`${urlPrefix.replace(':id', taskTest.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedTaskComment.id);
      expect(res.body.content).toBe(updatedTaskComment.content);
      expect(res.body.taskId).toBe(newTaskComment.taskId);
      expect(res.body.createdById).toBe(newTaskComment.createdById);
    });

    it('should return Bad Request for empty data', async () => {
      const task = tasks[0];
      const newTaskComment = await createTaskComment(task.id);
      const res = await request(app)
        .patch(`${urlPrefix.replace(':id', task.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .send({ })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.content).toBeDefined();
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .patch(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .send({ content: 'Updated content' })
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .patch(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .patch(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`DELETE ${urlPrefix}/:id`, () => {
    it('should delete one record by ID', async () => {
      const task = tasks[0];
      const newTaskComment = await createTaskComment(task.id);
      await request(app)
        .delete(`${urlPrefix.replace(':id', task.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .expect(204);
      await request(app)
        .get(`${urlPrefix.replace(':id', task.id)}/${newTaskComment.id}`)
        .set('Cookie', cookies)
        .expect(404);
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', taskTest.id)}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });
});
