import express from "express";
import controller from './task.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { validateDto } from "../common/validators";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateTaskDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export const taskRouteConfig: RouteConfig = {
  path: '/tasks',
  router,
};
