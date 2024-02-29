import express from "express";
import controller from './task.controller';
import { catchAsync } from "../common/exception-handlers";
import { RouteConfig } from "../common/types";

const router = express.Router();

router.get('/:id', catchAsync(controller.findById.bind(controller)));
router.get('/', catchAsync(controller.findAll.bind(controller)));

export const taskRouteConfig: RouteConfig = {
  path: '/tasks',
  router,
};
