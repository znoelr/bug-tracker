import { Express } from 'express';
import request from 'supertest';
import { ROLES } from '../../role/role.constants';
import { bootstrapApp } from '../../../app';
import { createTask } from './helpers/create-task';

let app: Express;

describe('[Task Resource]', () => {
  let task: any = null;

  beforeAll(async () => {
    app = await bootstrapApp();
    const { users, projects } = global.records;
    const adminUser: any = users.find(({username}) => username === ROLES.ADMIN.toLowerCase());
    const project: any = await projects[0];
    task = await createTask(app)(adminUser.id, project.id);
  });

  afterAll(async () => {
    await request(app).delete(`/tasks/${task.id}`);
  });

  // describe('[Authenticated User]', () => {
  //   it('should get all tasks', (done) => {
  //     request(app)
  //       .get('/tasks')
  //       .auth('username', 'password')
  //       .set('Accept', 'application/json')
  //       .expect('Content-Type', /json/)
  //       .expect((res) => {
  //         expect(res.body).toBeDefined();
  //         expect(Array.isArray(res.body)).toBe(true);
  //       })
  //       .expect(200, done);
  //   });

  //   it('should get a task by its ID', (done) => {
  //     request(app)
  //       .get(`/tasks/${task.id}`)
  //       .set('Accept', 'application/json')
  //       .expect('Content-Type', /json/)
  //       .expect((res) => {
  //         expect(res.body).toBeDefined();
  //         expect(res.body.id).toBe(task.id);
  //       })
  //       .expect(200, done);
  //   });

  //   it('should return 400 when sending invalid data', (done) => {
  //     request(app)
  //       .post('/tasks')
  //       .send({
  //         date: "03/09/2024",
  //         title: "First title",
  //         description: "Some data for description",
  //         type: "FEATURE",
  //       })
  //       .set('Accept', 'application/json')
  //       .expect('Content-Type', /json/)
  //       .expect((res) => {
  //         expect(res.body).toBeDefined();
  //         expect(res.body.status).toBeDefined();
  //         expect(res.body.severity).toBeDefined();
  //         expect(res.body.priority).toBeDefined();
  //       })
  //       .expect(400, done);
  //   });

  //   it.todo('should return 404 on get invalid ID');
  //   it.todo('should create a task');
  //   it.todo('should update a task by ID');
  //   it.todo('should delete a task by ID');
  // });

  describe('Unathenticated User', () => {
    it.todo('should return 401 when trying to get all tasks');
    it.todo('should return 401 when trying to a task by ID');
    it.todo('should return 401 when trying to create a task');
    it.todo('should return 401 when trying to update a task by ID');
    it.todo('should return 401 when trying to delete a task by ID');
  });

  describe('User with invalid credentials', () => {
    it.todo('should return 401 when trying to get all tasks');
    it.todo('should return 401 when trying to a task by ID');
    it.todo('should return 401 when trying to create a task');
    it.todo('should return 401 when trying to update a task by ID');
    it.todo('should return 401 when trying to delete a task by ID');
  });
});
