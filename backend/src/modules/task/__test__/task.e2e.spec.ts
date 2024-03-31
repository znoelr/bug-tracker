import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { ROLES } from '../../role/role.constants';
import { bootstrapApp } from '../../../app';
import { TASK_PRIORITY, TASK_SEVERITY, TASK_STATUS, TASK_TYPES } from '../task.constants';
import { fetchProjects, fetchTasks, fetchUser } from '../../../scripts/prisma-seed/fetch-records';
import { TaskDto } from '../dtos/task.dto';
import { ProjectDto } from '../../project/dtos/project.dto';
import { UserDto } from '../../user/dtos/user.dto';

let app: Express;
let cookies: string[];
let projects: ProjectDto[];
let tasks: TaskDto[];
let devUser: UserDto;

const urlPrefix = '/tasks';

const createTask = async (userId: string, projectId: string, body?: any) => {
  const res = await request(app)
    .post('/tasks')
    .set('Cookie', cookies)
    .send({
      title: `Random task ${uuid()}`,
      description: "Some data for description",
      type: TASK_TYPES.FEATURE,
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.NORMAL,
      assigneeId: userId,
      projectId: projectId,
      ...body,
    })
    .expect(201);
  return res.body;
};

describe('[TASK]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    projects = await fetchProjects();
    tasks = await fetchTasks();
    devUser = await fetchUser({username: ROLES.DEVELOPER.toLowerCase()});
    const adminUser = await fetchUser({username: ROLES.ADMIN.toLowerCase()});
    cookies = await global.signin(adminUser.id);
  });

  describe(`GET ${urlPrefix}`, () => {
    it('should return a list', async () => {
      const res = await request(app)
        .get(urlPrefix)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(urlPrefix)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(urlPrefix)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`POST ${urlPrefix}`, () => {
    it('should create a new "FEATURE"', async () => {
      const project = projects[0];
      const data = {
        title: `Random task ${uuid()}`,
        description: "Some data for description",
        type: TASK_TYPES.FEATURE,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const {body: newTask} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTask).toBeDefined();
      expect(newTask.id).toBeDefined();
      expect(newTask.title).toBe(data.title);
      expect(newTask.description).toBe(data.description);
      expect(newTask.type).toBe(data.type);
      expect(newTask.status).toBe(TASK_STATUS.UNDER_CONSTRUCTION);
      expect(newTask.priority).toBe(data.priority);
      expect(newTask.assigneeId).toBe(data.assigneeId);
      expect(newTask.projectId).toBe(data.projectId);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBe(newTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should set "status" for "FEATURE"', async () => {
      const project = projects[0];
      const data = {
        title: `Random task ${uuid()}`,
        description: "Some data for description",
        type: TASK_TYPES.FEATURE,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const {body: newTask} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTask).toBeDefined();
      expect(newTask.id).toBeDefined();
      expect(newTask.status).toBe(TASK_STATUS.UNDER_CONSTRUCTION);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.status).toBe(newTask.status);
    });

    it(`shouldn't override "status" for "FEATURE"`, async () => {
      const project = projects[0];
      const data = {
        title: `Random task ${uuid()}`,
        description: "Some data for description",
        type: TASK_TYPES.FEATURE,
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const {body: newTask} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTask).toBeDefined();
      expect(newTask.id).toBeDefined();
      expect(newTask.status).toBe(TASK_STATUS.UNDER_CONSTRUCTION);
      expect(newTask.status).not.toBe(data.status);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.status).toBe(newTask.status);
    });

    it('should create a new record without "description" for "FEATURE"', async () => {
      const project = projects[0];
      const data = {
        title: `Random task ${uuid()}`,
        type: TASK_TYPES.FEATURE,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const {body: newTask} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTask.id).toBeDefined();
      expect(newTask.title).toBe(data.title);
      expect(newTask.type).toBe(data.type);
      expect(newTask.status).toBe(TASK_STATUS.UNDER_CONSTRUCTION);
      expect(newTask.priority).toBe(data.priority);
      expect(newTask.assigneeId).toBe(data.assigneeId);
      expect(newTask.projectId).toBe(data.projectId);
      expect(newTask.description).toBeFalsy();
      expect(newTask.severity).toBeFalsy();

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBe(newTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should return Bad Request when sending "severity" for "FEATURE"', async () => {
      const project = projects[0];
      const data = {
        title: `Random task ${uuid()}`,
        description: "Some data for description",
        type: TASK_TYPES.FEATURE,
        severity: TASK_SEVERITY.HIGH,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('severity');
    });

    it('should create a new "BUG"', async () => {
      const project = projects[0];
      const data = {
        title: `Random task ${uuid()}`,
        description: "Some data for description",
        type: TASK_TYPES.BUG,
        severity: TASK_SEVERITY.HIGH,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const {body: newTask} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTask).toBeDefined();
      expect(newTask.id).toBeDefined();
      expect(newTask.severity).toBeDefined();

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBe(newTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should set "status" for "BUG"', async () => {
      const project = projects[0];
      const data = {
        title: `Random task ${uuid()}`,
        description: "Some data for description",
        type: TASK_TYPES.BUG,
        severity: TASK_SEVERITY.LOW,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const {body: newTask} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTask).toBeDefined();
      expect(newTask.id).toBeDefined();
      expect(newTask.status).toBe(TASK_STATUS.UNDER_CONSTRUCTION);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.status).toBe(newTask.status);
    });

    it(`shouldn't override "status" for "BUG"`, async () => {
      const project = projects[0];
      const data = {
        title: `Random task ${uuid()}`,
        description: "Some data for description",
        type: TASK_TYPES.BUG,
        severity: TASK_SEVERITY.MEDIUM,
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const {body: newTask} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTask).toBeDefined();
      expect(newTask.id).toBeDefined();
      expect(newTask.status).toBe(TASK_STATUS.UNDER_CONSTRUCTION);
      expect(newTask.status).not.toBe(data.status);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.status).toBe(newTask.status);
    });

    it('should create a new record without "description" for "BUG"', async () => {
      const project = projects[0];
      const data = {
        title: `Random task ${uuid()}`,
        type: TASK_TYPES.BUG,
        severity: TASK_SEVERITY.EXTREMELY_HIGH,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const {body: newTask} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newTask.id).toBeDefined();
      expect(newTask.title).toBe(data.title);
      expect(newTask.type).toBe(data.type);
      expect(newTask.status).toBe(TASK_STATUS.UNDER_CONSTRUCTION);
      expect(newTask.priority).toBe(data.priority);
      expect(newTask.assigneeId).toBe(data.assigneeId);
      expect(newTask.projectId).toBe(data.projectId);
      expect(newTask.description).toBeFalsy();
      expect(newTask.severity).toBe(data.severity);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBe(newTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should return Bad Request for missing "severity" for "BUG"', async () => {
      const project = projects[0];
      const data = {
        title: `Random task ${uuid()}`,
        description: "Some data for description",
        type: TASK_TYPES.BUG,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('severity');
    });

    it('should return Bad Request for empty data', async () => {
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send({})
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.title).toBeDefined();
      expect(res.body.errors.type).toBeDefined();
      expect(res.body.errors.priority).toBeDefined();
      expect(res.body.errors.assigneeId).toBeDefined();
      expect(res.body.errors.projectId).toBeDefined();
    });

    it('should return Bad Request for mising "title"', async () => {
      const project = projects[0];
      const data = {
        type: TASK_TYPES.FEATURE,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.title).toBeDefined();
      expect(res.body.errors.type).toBeUndefined();
      expect(res.body.errors.priority).toBeUndefined();
      expect(res.body.errors.assigneeId).toBeUndefined();
      expect(res.body.errors.projectId).toBeUndefined();
    });

    it('should return Bad Request for existing "title"', async () => {
      const project = projects[0];
      const data = {
        type: TASK_TYPES.FEATURE,
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const newTask = await createTask(devUser.id, project.id);
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send({
          ...data,
          title: newTask.title,
        })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('title');
    });

    it('should return Bad Request for mising "type"', async () => {
      const project = projects[0];
      const data = {
        title: `New task ${uuid()}`,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.type).toBeDefined();
      expect(res.body.errors.title).toBeUndefined();
      expect(res.body.errors.priority).toBeUndefined();
      expect(res.body.errors.assigneeId).toBeUndefined();
      expect(res.body.errors.projectId).toBeUndefined();
    });

    it('should return Bad Request for mising "priority"', async () => {
      const project = projects[0];
      const data = {
        title: `New task ${uuid()}`,
        type: TASK_TYPES.FEATURE,
        assigneeId: devUser.id,
        projectId: project.id,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.priority).toBeDefined();
      expect(res.body.errors.title).toBeUndefined();
      expect(res.body.errors.type).toBeUndefined();
      expect(res.body.errors.assigneeId).toBeUndefined();
      expect(res.body.errors.projectId).toBeUndefined();
    });

    it('should return Bad Request for mising "assigneeId"', async () => {
      const project = projects[0];
      const data = {
        title: `New task ${uuid()}`,
        type: TASK_TYPES.FEATURE,
        priority: TASK_PRIORITY.NORMAL,
        projectId: project.id,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.assigneeId).toBeDefined();
      expect(res.body.errors.title).toBeUndefined();
      expect(res.body.errors.type).toBeUndefined();
      expect(res.body.errors.priority).toBeUndefined();
      expect(res.body.errors.projectId).toBeUndefined();
    });

    it('should return Bad Request for mising "projectId"', async () => {
      const data = {
        title: `New task ${uuid()}`,
        type: TASK_TYPES.FEATURE,
        priority: TASK_PRIORITY.NORMAL,
        assigneeId: devUser.id,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.projectId).toBeDefined();
      expect(res.body.errors.title).toBeUndefined();
      expect(res.body.errors.type).toBeUndefined();
      expect(res.body.errors.priority).toBeUndefined();
      expect(res.body.errors.assigneeId).toBeUndefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .post(urlPrefix)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .post(urlPrefix)
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
        .put(urlPrefix)
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
        .patch(urlPrefix)
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
        .delete(urlPrefix)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`GET ${urlPrefix}/:id`, () => {
    it('should return one record by ID', async () => {
      const task = tasks[0];
      const res = await request(app)
        .get(`${urlPrefix}/${task.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(task.id);
      expect(res.body.title).toBe(task.title);
      expect(res.body.description).toBe(task.description);
      expect(res.body.type).toBe(task.type);
      expect(res.body.status).toBe(task.status);
      expect(res.body.priority).toBe(task.priority);
      expect(res.body.assigneeId).toBe(task.assigneeId);
      expect(res.body.projectId).toBe(task.projectId);
    });
  
    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(`${urlPrefix}/${uuid()}`)
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
        .post(`${urlPrefix}/${uuid()}`)
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
        .put(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`PATCH ${urlPrefix}/:id`, () => {
    it('should update "title"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id);
      const newTitle = `Up New title ${uuid()}`;
      const {body: updatedTask} = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ title: newTitle })
        .expect(200);
      expect(updatedTask.id).toBe(newTask.id);
      expect(updatedTask.title).toBe(newTitle);
      expect(updatedTask.title).not.toBe(newTask.title);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedTask.id);
      expect(res.body.title).toBe(updatedTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBe(newTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should return Bad Request for existing "title"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id);
      const res = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ title: tasks[0].title })
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('title');

      const res2 = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res2.body.id).toBe(newTask.id);
      expect(res2.body.title).toBe(newTask.title);
      expect(res2.body.description).toBe(newTask.description);
      expect(res2.body.type).toBe(newTask.type);
      expect(res2.body.status).toBe(newTask.status);
      expect(res2.body.severity).toBe(newTask.severity);
      expect(res2.body.priority).toBe(newTask.priority);
      expect(res2.body.assigneeId).toBe(newTask.assigneeId);
      expect(res2.body.projectId).toBe(newTask.projectId);
    });

    it('should update "description"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id);
      const newDescription = `Updated role description - ${uuid()}`;
      const {body: updatedTask} = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ description: newDescription })
        .expect(200);
      expect(updatedTask.id).toBe(newTask.id);
      expect(updatedTask.description).toBe(newDescription);
      expect(updatedTask.description).not.toBe(newTask.description);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(updatedTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBe(newTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should update "type" from "FEATURE" to "BUG"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id, {
        type: TASK_TYPES.FEATURE,
      });
      const {body: updatedTask} = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({
          type: TASK_TYPES.BUG,
          severity: TASK_SEVERITY.HIGH,
        })
        .expect(200);
      expect(updatedTask.id).toBe(newTask.id);
      expect(updatedTask.type).toBe(TASK_TYPES.BUG);
      expect(updatedTask.type).not.toBe(newTask.type);
      expect(updatedTask.severity).toBeDefined();

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(updatedTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBe(updatedTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should return Bad Request when updating "type" from "FEATURE" to "BUG" for missing "severity"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id, {
        type: TASK_TYPES.FEATURE,
      });
      const res = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ type: TASK_TYPES.BUG })
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('severity');

      const res2 = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res2.body.id).toBe(newTask.id);
      expect(res2.body.title).toBe(newTask.title);
      expect(res2.body.description).toBe(newTask.description);
      expect(res2.body.type).toBe(newTask.type);
      expect(res2.body.status).toBe(newTask.status);
      expect(res2.body.severity).toBe(newTask.severity);
      expect(res2.body.priority).toBe(newTask.priority);
      expect(res2.body.assigneeId).toBe(newTask.assigneeId);
      expect(res2.body.projectId).toBe(newTask.projectId);
    });

    it('should update "type" from "BUG" to "FEATURE"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id, {
        type: TASK_TYPES.BUG,
        severity: TASK_SEVERITY.MEDIUM,
      });
      const {body: updatedTask} = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ type: TASK_TYPES.FEATURE })
        .expect(200);
      expect(updatedTask.id).toBe(newTask.id);
      expect(updatedTask.type).toBe(TASK_TYPES.FEATURE);
      expect(updatedTask.type).not.toBe(newTask.type);
      expect(updatedTask.severity).toBeFalsy();

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(updatedTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBe(updatedTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should update "status"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id, {
        status: TASK_STATUS.IN_REVIEW,
      });
      const newStatus = TASK_STATUS.IN_PROGRESS;
      const {body: updatedTask} = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ status: newStatus })
        .expect(200);
      expect(updatedTask.id).toBe(newTask.id);
      expect(updatedTask.status).toBe(newStatus);
      expect(updatedTask.status).not.toBe(newTask.status);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(updatedTask.status);
      expect(res.body.severity).toBe(newTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should update "severity" for "BUG"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id, {
        type: TASK_TYPES.BUG,
        severity: TASK_SEVERITY.LOW,
      });
      const newSeverity = TASK_SEVERITY.EXTREMELY_HIGH;
      const {body: updatedTask} = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ severity: newSeverity })
        .expect(200);
      expect(updatedTask.id).toBe(newTask.id);
      expect(updatedTask.severity).toBe(newSeverity);
      expect(updatedTask.severity).not.toBe(newTask.severity);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBe(updatedTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should return Bad Request when sending "severity" for "FEATURE"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id, {
        type: TASK_TYPES.FEATURE,
      });
      const newSeverity = TASK_SEVERITY.EXTREMELY_HIGH;
      const res = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ severity: newSeverity })
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('severity');

      const res2 = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res2.body.id).toBe(newTask.id);
      expect(res2.body.title).toBe(newTask.title);
      expect(res2.body.description).toBe(newTask.description);
      expect(res2.body.type).toBe(newTask.type);
      expect(res2.body.status).toBe(newTask.status);
      expect(res2.body.severity).toBeFalsy();
      expect(res2.body.severity).toBe(newTask.severity);
      expect(res2.body.priority).toBe(newTask.priority);
      expect(res2.body.assigneeId).toBe(newTask.assigneeId);
      expect(res2.body.projectId).toBe(newTask.projectId);
    });

    it('should update "priority"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id, {
        priority: TASK_PRIORITY.LOW,
      });
      const newPriority = TASK_PRIORITY.EXTREMELY_HIGH;
      const {body: updatedTask} = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ priority: newPriority })
        .expect(200);
      expect(updatedTask.id).toBe(newTask.id);
      expect(updatedTask.priority).toBe(newPriority);
      expect(updatedTask.priority).not.toBe(newTask.priority);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBeFalsy();
      expect(res.body.severity).toBe(newTask.severity);
      expect(res.body.priority).toBe(updatedTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should update "assigneeId"', async () => {
      const project = projects[0];
      const testUser = await fetchUser({username: ROLES.TESTER.toLowerCase()});
      const newTask = await createTask(devUser.id, project.id);
      const newAssigneeId = testUser.id;
      const {body: updatedTask} = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ assigneeId: newAssigneeId })
        .expect(200);
      expect(updatedTask.id).toBe(newTask.id);
      expect(updatedTask.assigneeId).toBe(newAssigneeId);
      expect(updatedTask.assigneeId).not.toBe(newTask.assigneeId);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBeFalsy();
      expect(res.body.severity).toBe(newTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(updatedTask.assigneeId);
      expect(res.body.projectId).toBe(newTask.projectId);
    });

    it('should update "projectId"', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id);
      const newProjectId = projects[1].id;
      const {body: updatedTask} = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ projectId: newProjectId })
        .expect(200);
      expect(updatedTask.id).toBe(newTask.id);
      expect(updatedTask.projectId).toBe(newProjectId);
      expect(updatedTask.projectId).not.toBe(newTask.projectId);

      const res = await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newTask.id);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.type).toBe(newTask.type);
      expect(res.body.status).toBe(newTask.status);
      expect(res.body.severity).toBeFalsy();
      expect(res.body.severity).toBe(newTask.severity);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.assigneeId).toBe(newTask.assigneeId);
      expect(res.body.projectId).toBe(updatedTask.projectId);
    });

    it('should return Bad Request for empty data', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id);
      const res = await request(app)
        .patch(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .send({ })
        .expect(400);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .patch(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .send({ title: `some new title ${uuid()}` })
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .patch(`${urlPrefix}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .patch(`${urlPrefix}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`DELETE ${urlPrefix}/:id`, () => {
    it('should delete one record by ID', async () => {
      const project = projects[0];
      const newTask = await createTask(devUser.id, project.id);
      await request(app)
        .delete(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(204);
      await request(app)
        .get(`${urlPrefix}/${newTask.id}`)
        .set('Cookie', cookies)
        .expect(404);
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .delete(`${urlPrefix}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });
});
