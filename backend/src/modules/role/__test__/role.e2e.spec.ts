import request from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { bootstrapApp } from '../../../app';
import { fetchRoles, fetchUser } from '../../../scripts/prisma-seed/fetch-records';
import { ROLES } from '../role.constants';
import { UserDto } from '../../user/dtos/user.dto';
import { RoleDto } from '../dtos/role.dto';

let app: Express;
let adminUser: UserDto;
let cookies: string[];
let roles: RoleDto[];

const createTestRole = async (): Promise<RoleDto> => {
  const res = await request(app)
    .post('/roles')
    .set('Cookie', cookies)
    .send({
      name: `New Role - ${uuid()}`,
      description: 'Some descrition',
    })
    .expect(201);
  return res.body;
}

describe('[ROLE]', () => {
  beforeAll(async() => {
    app = await bootstrapApp();
    adminUser = await fetchUser({ username: ROLES.ADMIN.toLowerCase() })
    roles = await fetchRoles();
    cookies = await global.signin(adminUser.id);
  });

  it('should return a list of roles', async () => {
    const res = await request(app)
      .get('/roles')
      .set('Cookie', cookies)
      .expect(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new role', async () => {
    const data = {
      name: `New Role - ${uuid()}`,
      description: 'Some descrition',
    };
    const res = await request(app)
      .post('/roles')
      .set('Cookie', cookies)
      .send(data)
      .expect(201);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe(data.name);
    expect(res.body.description).toBe(data.description);
  });

  it('should throw Bad Request when creating a new role with empty data', async () => {
    await request(app)
      .post('/roles')
      .set('Cookie', cookies)
      .send({})
      .expect(400);
  });

  it('should throw Bad Request when creating a new role with mising "name" data', async () => {
    await request(app)
      .post('/roles')
      .set('Cookie', cookies)
      .send({ description: 'SOme description' })
      .expect(400);
  });

  it('should throw Bad Request when creating a new role with already existing "name"', async () => {
    await request(app)
      .post('/roles')
      .set('Cookie', cookies)
      .send({ name: ROLES.DEVELOPER })
      .expect(400);
  });

  it('should return a specified role by ID', async () => {
    const res = await request(app)
      .get(`/roles/${roles[0].id}`)
      .set('Cookie', cookies)
      .expect(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(roles[0].id);
  });

  it('should throw Not Found when fetching a role with invalid ID', async () => {
    await request(app)
      .get(`/roles/${uuid()}`)
      .set('Cookie', cookies)
      .expect(404);
  });
  
  it('should patch "name" for a specified role by ID', async () => {
    const testRole = await createTestRole();
    const newName = `Updated role name - ${uuid()}`;
    const res = await request(app)
      .patch(`/roles/${testRole.id}`)
      .set('Cookie', cookies)
      .send({ name: newName })
      .expect(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(testRole.id);
    expect(res.body.name).toBe(newName);
    expect(res.body.description).toBe(testRole.description);
  });

  it('should update "description" for a specified role by ID', async () => {
    const testRole = await createTestRole();
    const newDescription = `Updated role description - ${uuid()}`;
    const res = await request(app)
      .patch(`/roles/${testRole.id}`)
      .set('Cookie', cookies)
      .send({ description: newDescription })
      .expect(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(testRole.id);
    expect(res.body.name).toBe(testRole.name);
    expect(res.body.description).toBe(newDescription);
  });

  it('should throw Bad Request when updating existing "name" for a specified role by ID', async () => {
    const testRole = await createTestRole();
    await request(app)
      .patch(`/roles/${testRole.id}`)
      .set('Cookie', cookies)
      .send({ name: ROLES.ADMIN })
      .expect(400);
  });

  it('should throw Not Found when updating a specified role by ID', async () => {
    await request(app)
      .patch(`/roles/${uuid()}`)
      .set('Cookie', cookies)
      .send({ name: 'Some random name' })
      .expect(404);
  });

  it('should delete a specified role by ID', async () => {
    const testRole = await createTestRole();
    await request(app)
      .delete(`/roles/${testRole.id}`)
      .set('Cookie', cookies)
      .expect(204);
  });

  it('should throw 404 when deleting a role with invalid ID', async () => {
    await request(app)
      .delete(`/roles/${uuid()}`)
      .set('Cookie', cookies)
      .expect(404);
  });
});
