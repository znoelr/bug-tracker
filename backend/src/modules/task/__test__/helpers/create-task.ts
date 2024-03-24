import request from 'supertest';
import { Express } from 'express';
import { TASK_PRIORITY, TASK_STATUS, TASK_TYPES } from "../../task.constants";

export const createTask = (app: Express) => async (userId: string, projectId: string) => {
  const response = await request(app)
    .post('/tasks')
    .set('Cookie', global.signin(userId))
    .send({
      "title": `First title ${Date.now()}`,
      "description": "Some data for description",
      "type": TASK_TYPES.FEATURE,
      "status": TASK_STATUS.IN_PROGRESS,
      "priority": TASK_PRIORITY.NORMAL,
      "assigneeId": userId,
      "projectId": projectId,
    });
  return response.body;
};
