import express from "express";
import controller from './task-log.controller';
import { routeFactory } from "../../../common/route-handlers";
import { RouteConfig } from "../../../common/types";
import { validateDto } from "../../../common/validators";
import { CreateTaskLogDto } from "./dtos/create-task-log.dto";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateTaskLogDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export const taskLogRouteConfig: RouteConfig = {
  path: '/task-logs',
  router,
};
