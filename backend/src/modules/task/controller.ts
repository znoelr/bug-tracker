import { NextFunction, Request, Response } from "express";
import { catchAsync } from '../common/exception-handlers';
import taskService from "./service";

export default {
  findById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add validations to req data
    const { id } = req.params;
    const task = await taskService.findById(id);
    res.json(task);
  }),
  
  findAll: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await taskService.findAll({ limit: 20, nextId: '' });
    res.json(tasks);
  }),
};
