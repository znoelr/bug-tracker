import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { ROLES } from '../../role/role.constants';
import { bootstrapApp } from '../../../app';
import { fetchProjects, fetchUser } from '../../../scripts/prisma-seed/fetch-records';
import { ProjectDto } from '../dtos/project.dto';
import { UserDto } from '../../user/dtos/user.dto';
import { PROJECT_STATUS } from '../project.constants';

let app: Express;
let cookies: string[];
let projects: ProjectDto[];
let adminUser: UserDto;
let managerUser: UserDto;

const urlPrefix = '/projects';

const createProject = async (userCookies?: string[]) => {
  const reqCookies = userCookies || cookies;
  const res = await request(app)
    .post('/projects')
    .set('Cookie', reqCookies)
    .send({
      title: `New project ${uuid()}`,
      name: `Some name ${uuid()}`,
      description: `Some description ${uuid()}`,
      status: PROJECT_STATUS.FINISHED,
    })
    .expect(201);
  return res.body;
};

describe('[PROJECT]', () => {
  beforeAll(async () => {
    app = await bootstrapApp();
    projects = await fetchProjects();
    adminUser = await fetchUser({username: ROLES.ADMIN.toLowerCase()});
    managerUser = await fetchUser({username: ROLES.MANAGER.toLowerCase()});
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
    it('should create a new record', async () => {
      const data = {
        title: `New project ${uuid()}`,
        name: `Some name ${uuid()}`,
        description: `Some description ${uuid()}`,
        status: PROJECT_STATUS.FINISHED,
      };
      const {body: newProject} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newProject.id).toBeDefined();
      expect(newProject.title).toBe(data.title);
      expect(newProject.name).toBe(data.name);
      expect(newProject.description).toBe(data.description);
      expect(newProject.status).toBe(data.status);

      const res = await request(app)
        .get(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newProject.id);
      expect(res.body.title).toBe(newProject.title);
      expect(res.body.name).toBe(newProject.name);
      expect(res.body.description).toBe(newProject.description);
      expect(res.body.status).toBe(newProject.status);
    });

    it('should create a new record without "description"', async () => {
      const data = {
        title: `New project ${uuid()}`,
        name: `Some name ${uuid()}`,
        status: PROJECT_STATUS.FINISHED,
      };
      const {body: newProject} = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(201);
      expect(newProject.id).toBeDefined();
      expect(newProject.title).toBe(data.title);
      expect(newProject.name).toBe(data.name);
      expect(newProject.description).toBeFalsy();
      expect(newProject.status).toBe(data.status);

      const res = await request(app)
        .get(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newProject.id);
      expect(res.body.title).toBe(newProject.title);
      expect(res.body.name).toBe(newProject.name);
      expect(res.body.description).toBe(newProject.description);
      expect(res.body.status).toBe(newProject.status);
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
      expect(res.body.errors.name).toBeDefined();
      expect(res.body.errors.status).toBeDefined();
    });

    it('should return Bad Request for existing "title"', async () => {
      const project = await createProject();
      const data = {
        title: project.title,
        name: `Some name ${uuid()}`,
        description: `Some description ${uuid()}`,
        status: PROJECT_STATUS.FINISHED,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('title');
    });

    it('should return Bad Request for missing "title"', async () => {
      const data = {
        name: `Some name ${uuid()}`,
        description: `Some description ${uuid()}`,
        status: PROJECT_STATUS.FINISHED,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.title).toBeDefined();
      expect(res.body.errors.name).toBeUndefined();
      expect(res.body.errors.description).toBeUndefined();
      expect(res.body.errors.status).toBeUndefined();
    });

    it('should return Bad Request for missing "name"', async () => {
      const data = {
        title: `New title ${uuid()}`,
        description: `Some description ${uuid()}`,
        status: PROJECT_STATUS.FINISHED,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.title).toBeUndefined();
      expect(res.body.errors.name).toBeDefined();
      expect(res.body.errors.description).toBeUndefined();
      expect(res.body.errors.status).toBeUndefined();
    });

    it('should return Bad Request for invalid "status"', async () => {
      const data = {
        title: `New title ${uuid()}`,
        name: `Some name ${uuid()}`,
        description: `Some description ${uuid()}`,
        status: 'Invalid status',
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.title).toBeUndefined();
      expect(res.body.errors.name).toBeUndefined();
      expect(res.body.errors.description).toBeUndefined();
      expect(res.body.errors.status).toBeDefined();
    });

    it('should return Bad Request for missing "status"', async () => {
      const data = {
        title: `New title ${uuid()}`,
        name: `Some name ${uuid()}`,
        description: `Some description ${uuid()}`,
      };
      const res = await request(app)
        .post(urlPrefix)
        .set('Cookie', cookies)
        .send(data)
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.title).toBeUndefined();
      expect(res.body.errors.name).toBeUndefined();
      expect(res.body.errors.description).toBeUndefined();
      expect(res.body.errors.status).toBeDefined();
    });

    it('should set "createdById" to logged in user ID', async () => {
      const adminCookies = global.signin(adminUser.id);
      const p1Data = {
        title: `New title ${uuid()}`,
        name: `Some name ${uuid()}`,
        description: `Some description ${uuid()}`,
        status: PROJECT_STATUS.FINISHED,
      };
      const {body: newProject} = await request(app)
        .post(urlPrefix)
        .set('Cookie', adminCookies)
        .send(p1Data)
        .expect(201);
      expect(newProject.title).toBe(p1Data.title);
      expect(newProject.name).toBe(p1Data.name);
      expect(newProject.description).toBe(p1Data.description);
      expect(newProject.status).toBe(p1Data.status);
      expect(newProject.createdById).toBe(adminUser.id);

      const managerCookies = global.signin(managerUser.id);
      const data = {
        title: `New title ${uuid()}`,
        name: `Some name ${uuid()}`,
        description: `Some description ${uuid()}`,
        status: PROJECT_STATUS.FINISHED,
      };
      const {body: newProject2} = await request(app)
        .post(urlPrefix)
        .set('Cookie', managerCookies)
        .send(data)
        .expect(201);
      expect(newProject2.title).toBe(data.title);
      expect(newProject2.name).toBe(data.name);
      expect(newProject2.description).toBe(data.description);
      expect(newProject2.status).toBe(data.status);
      expect(newProject2.createdById).toBe(managerUser.id);
    });

    it(`shouldn't override "createdById"`, async () => {
      const adminCookies = global.signin(adminUser.id);
      const data = {
        title: `New title ${uuid()}`,
        name: `Some name ${uuid()}`,
        description: `Some description ${uuid()}`,
        status: PROJECT_STATUS.FINISHED,
        createdById: managerUser.id,
      };
      const {body: newProject} = await request(app)
        .post(urlPrefix)
        .set('Cookie', adminCookies)
        .send(data)
        .expect(201);
      expect(newProject.title).toBe(data.title);
      expect(newProject.name).toBe(data.name);
      expect(newProject.description).toBe(data.description);
      expect(newProject.status).toBe(data.status);
      expect(newProject.createdById).toBe(adminUser.id);
      expect(newProject.createdById).not.toBe(managerUser.id);
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
      const project = projects[0];
      const res = await request(app)
        .get(`${urlPrefix}/${project.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(project.id);
      expect(res.body.title).toBe(project.title);
      expect(res.body.name).toBe(project.name);
      expect(res.body.description).toBe(project.description);
      expect(res.body.status).toBe(project.status);
      expect(res.body.createdById).toBe(project.createdById);
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
      const newProject = await createProject();
      const newTitle = `Up New title ${uuid()}`;
      const {body: updatedProject} = await request(app)
        .patch(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .send({ title: newTitle })
        .expect(200);
      expect(updatedProject.id).toBe(newProject.id);
      expect(updatedProject.title).toBe(newTitle);
      expect(updatedProject.title).not.toBe(newProject.title);

      const res = await request(app)
        .get(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedProject.id);
      expect(res.body.title).toBe(updatedProject.title);
      expect(res.body.name).toBe(newProject.name);
      expect(res.body.description).toBe(newProject.description);
      expect(res.body.status).toBe(newProject.status);
      expect(res.body.createdById).toBe(newProject.createdById);
    });

    it('should return Bad Request for existing "title"', async () => {
      const newProject = await createProject();
      const res = await request(app)
        .patch(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .send({ title: projects[0].title })
        .expect(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.message).toBeDefined();
      expect(res.body.errors.message).toContain('title');

      const res2 = await request(app)
        .get(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .expect(200);
        expect(res2.body.id).toBe(newProject.id);
        expect(res2.body.title).toBe(newProject.title);
        expect(res2.body.name).toBe(newProject.name);
        expect(res2.body.description).toBe(newProject.description);
        expect(res2.body.status).toBe(newProject.status);
        expect(res2.body.createdById).toBe(newProject.createdById);
    });

    it('should update "name"', async () => {
      const newProject = await createProject();
      const newName = `Up New name ${uuid()}`;
      const {body: updatedProject} = await request(app)
        .patch(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .send({ name: newName })
        .expect(200);
      expect(updatedProject.id).toBe(newProject.id);
      expect(updatedProject.name).toBe(newName);
      expect(updatedProject.name).not.toBe(newProject.name);

      const res = await request(app)
        .get(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedProject.id);
      expect(res.body.title).toBe(newProject.title);
      expect(res.body.name).toBe(updatedProject.name);
      expect(res.body.description).toBe(newProject.description);
      expect(res.body.status).toBe(newProject.status);
      expect(res.body.createdById).toBe(newProject.createdById);
    });

    it('should update "description"', async () => {
      const newProject = await createProject();
      const newDescription = `Up New title ${uuid()}`;
      const {body: updatedProject} = await request(app)
        .patch(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .send({ description: newDescription })
        .expect(200);
      expect(updatedProject.id).toBe(newProject.id);
      expect(updatedProject.description).toBe(newDescription);
      expect(updatedProject.description).not.toBe(newProject.description);

      const res = await request(app)
        .get(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedProject.id);
      expect(res.body.title).toBe(newProject.title);
      expect(res.body.name).toBe(newProject.name);
      expect(res.body.description).toBe(updatedProject.description);
      expect(res.body.status).toBe(newProject.status);
      expect(res.body.createdById).toBe(newProject.createdById);
    });

    it('should update "status"', async () => {
      const newProject = await createProject();
      const newStatus = PROJECT_STATUS.CLOSED;
      const {body: updatedProject} = await request(app)
        .patch(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .send({ status: newStatus })
        .expect(200);
      expect(updatedProject.id).toBe(newProject.id);
      expect(updatedProject.status).toBe(newStatus);
      expect(updatedProject.status).not.toBe(newProject.status);

      const res = await request(app)
        .get(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(updatedProject.id);
      expect(res.body.title).toBe(updatedProject.title);
      expect(res.body.name).toBe(newProject.name);
      expect(res.body.description).toBe(newProject.description);
      expect(res.body.status).toBe(newStatus);
      expect(res.body.createdById).toBe(newProject.createdById);
    });

    it(`shouldn't update invalid "status"`, async () => {
      const newProject = await createProject();
      const newStatus = 'Invalid status'
      const res = await request(app)
        .patch(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .send({ status: newStatus })
        .expect(400);
      expect(res.body.errors).toBeDefined()
      expect(res.body.errors.status).toBeDefined()

      const res2 = await request(app)
        .get(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res2.body.id).toBe(newProject.id);
      expect(res2.body.title).toBe(newProject.title);
      expect(res2.body.name).toBe(newProject.name);
      expect(res2.body.description).toBe(newProject.description);
      expect(res2.body.status).toBe(newProject.status);
      expect(res2.body.createdById).toBe(newProject.createdById);
    });

    it(`shouldn't update "createdById"`, async () => {
      const managerCookies = await global.signin(managerUser.id);
      const newProject = await createProject(managerCookies);
      const newCreatedById = adminUser.id;
      const {body: updatedProject} = await request(app)
        .patch(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .send({
          name: newProject.name,
          createdById: newCreatedById,
        })
        .expect(200);
      expect(updatedProject.id).toBe(newProject.id);
      expect(updatedProject.title).toBe(newProject.title);
      expect(updatedProject.name).toBe(newProject.name);
      expect(updatedProject.description).toBe(newProject.description);
      expect(updatedProject.status).toBe(newProject.status);
      expect(updatedProject.createdById).toBe(newProject.createdById);
      expect(updatedProject.createdById).not.toBe(newCreatedById);

      const res = await request(app)
        .get(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.id).toBe(newProject.id);
      expect(res.body.title).toBe(newProject.title);
      expect(res.body.name).toBe(newProject.name);
      expect(res.body.description).toBe(newProject.description);
      expect(res.body.status).toBe(newProject.status);
      expect(res.body.createdById).toBe(newProject.createdById);
    });

    it('should return Bad Request for empty data', async () => {
      const newProject = await createProject();
      const res = await request(app)
        .patch(`${urlPrefix}/${newProject.id}`)
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
      const newProject = await createProject();
      await request(app)
        .delete(`${urlPrefix}/${newProject.id}`)
        .set('Cookie', cookies)
        .expect(204);
      await request(app)
        .get(`${urlPrefix}/${newProject.id}`)
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
