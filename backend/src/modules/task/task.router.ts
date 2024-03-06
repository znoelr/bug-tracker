import express from "express";
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { validateDto } from "../common/validators";
import controller from './task.controller';
import taskCommentsRouter from './modules/task-comment/task-comment.router'
import { parseParamsForQueryFilter } from "../middleware";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateTaskDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

/** Nested task comments */
router.use(`/:taskId/comments`, taskCommentsRouter);

export const taskRouteConfig: RouteConfig = {
  path: '/tasks',
  router,
};
