import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { ROLES } from '../../../../role/role.constants';
import { bootstrapApp } from '../../../../../app';
import { fetchUser } from '../../../../../scripts/prisma-seed/fetch-records';
import { UserDto } from '../../../../user/dtos/user.dto';
import { ProjectDto } from '../../../dtos/project.dto';
import { FileDto } from '../../../../file/dtos/file.dto';
import { PROJECT_STATUS } from '../../../project.constants';

let app: Express;
let cookies: string[];
let adminUser: UserDto;
let managerUser: UserDto;
let testProject: ProjectDto;
let testProjectFiles: FileDto[];

const urlPrefix = '/projects/:id/files';

const createProject = async () => {
  const res = await request(app)
    .post('/projects')
    .set('Cookie', cookies)
    .send({
      title: `New project ${uuid()}`,
      name: `New project name ${uuid()}`,
      description: `Project description ${uuid()}`,
      status: PROJECT_STATUS.IN_PROGRESS,
      createdById: managerUser.id,
    })
    .expect(201);
  return res.body;
};

const createProjectFiles = async (projectId: string, count: number = 3) => {
  const promises = new Array(count).fill(null).map(async () => await request(app)
    .post(urlPrefix.replace(':id', projectId))
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

describe('[PROJECT_FILES]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    adminUser = await fetchUser({username: ROLES.ADMIN.toLowerCase()});
    managerUser = await fetchUser({username: ROLES.MANAGER.toLowerCase()});
    cookies = await global.signin(adminUser.id);
    testProject = await createProject();
    testProjectFiles = await createProjectFiles(testProject.id);
  });

  describe(`GET ${urlPrefix}`, () => {
    it('should return a list', async () => {
      const res = await request(app)
        .get(urlPrefix.replace(':id', testProject.id))
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every((f: FileDto) => !!f.id)).toBe(true);
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(urlPrefix.replace(':id', testProject.id))
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(urlPrefix.replace(':id', testProject.id))
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
      const {body: newProjectFile} = await request(app)
        .post(urlPrefix.replace(':id', testProject.id))
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newProjectFile.id).toBeDefined();
      expect(newProjectFile.name).toBe(data.name);
      expect(newProjectFile.mimetype).toBe(data.mimetype);
      expect(newProjectFile.url).toBe(data.url);

      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testProject.id)}/${newProjectFile.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newProjectFile.id);
      expect(res.body.name).toBe(newProjectFile.name);
      expect(res.body.mimetype).toBe(newProjectFile.mimetype);
      expect(res.body.url).toBe(newProjectFile.url);
    });

    it('should return Bad Request for empty data', async () => {
      const res = await request(app)
        .post(urlPrefix.replace(':id', testProject.id))
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
        .post(urlPrefix.replace(':id', testProject.id))
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
        .post(urlPrefix.replace(':id', testProject.id))
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
        .post(urlPrefix.replace(':id', testProject.id))
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
        .post(urlPrefix.replace(':id', testProject.id))
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
        .post(urlPrefix.replace(':id', testProject.id))
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
        .post(urlPrefix.replace(':id', testProject.id))
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .post(urlPrefix.replace(':id', testProject.id))
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
        .put(urlPrefix.replace(':id', testProject.id))
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
        .patch(urlPrefix.replace(':id', testProject.id))
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
        .delete(urlPrefix.replace(':id', testProject.id))
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`GET ${urlPrefix}/:id`, () => {
    it('should return one record by ID', async () => {
      const project = testProject;
      const projectFile = testProjectFiles[0];
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', project.id)}/${projectFile.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(projectFile.id);
      expect(res.body.name).toBe(projectFile.name);
      expect(res.body.mimetype).toBe(projectFile.mimetype);
      expect(res.body.url).toBe(projectFile.url);
    });
  
    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testProject.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testProject.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .get(`${urlPrefix.replace(':id', testProject.id)}/${uuid()}`)
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
        .post(`${urlPrefix.replace(':id', testProject.id)}/${uuid()}`)
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
        .put(`${urlPrefix.replace(':id', testProject.id)}/${uuid()}`)
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
        .patch(`${urlPrefix.replace(':id', testProject.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });

  describe(`DELETE ${urlPrefix}/:id`, () => {
    it('should delete one record by ID', async () => {
      const [newProjectFile] = await createProjectFiles(testProject.id, 1);
      await request(app)
        .delete(`${urlPrefix.replace(':id', testProject.id)}/${newProjectFile.id}`)
        .set('Cookie', cookies)
        .expect(204);
      await request(app)
        .get(`${urlPrefix.replace(':id', testProject.id)}/${newProjectFile.id}`)
        .set('Cookie', cookies)
        .expect(404);
    });

    it('should return Not Found for invalid ID', async () => {
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', testProject.id)}/${uuid()}`)
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Unauthorized for missing credentials', async () => {
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', testProject.id)}/${uuid()}`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });

    it('should return Forbidden for lack of access', async () => {
      const newUserCookies = await global.signinNewUser(cookies, app);
      const res = await request(app)
        .delete(`${urlPrefix.replace(':id', testProject.id)}/${uuid()}`)
        .set('Cookie', newUserCookies)
        .expect(403);
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
    });
  });
});
