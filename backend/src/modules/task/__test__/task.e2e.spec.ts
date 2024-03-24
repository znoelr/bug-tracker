import { Express } from 'express';
import request from 'supertest';
import { ROLES } from '../../role/role.constants';
import { bootstrapApp } from '../../../app';
import { UserDto } from '../../user/dtos/user.dto';
import { TASK_PRIORITY, TASK_STATUS, TASK_TYPES } from '../task.constants';

let app: Express;
let adminUser: UserDto;
let cookies: string[];

describe('[TASK]', () => {
  let task: any = null;

  beforeAll(async () => {
    app = await bootstrapApp();
    adminUser = global.records.users.find(({username}) => username === ROLES.ADMIN.toLowerCase())!;
    cookies = await global.signin(adminUser.id);

    const res = await request(app)
      .post('/tasks')
      .set('Cookie', cookies)
      .send({
        "title": `First title ${Date.now()}`,
        "description": "Some data for description",
        "type": TASK_TYPES.FEATURE,
        "status": TASK_STATUS.IN_PROGRESS,
        "priority": TASK_PRIORITY.NORMAL,
        "assigneeId": adminUser.id,
        "projectId": global.records.projects[0].id,
      })
      .expect(201);
    task = res.body;
  });

  it('should get all tasks', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Cookie', cookies)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);
  });

  // describe('[Authenticated User]', () => {

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
