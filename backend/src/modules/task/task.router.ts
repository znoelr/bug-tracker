import express from "express";
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { validateDtoAndInjectId } from "../common/validators";
import { findResourceByRequestQueryFilters, injectQueryFiltersfromParams, parseParamsForQueryFilter } from "../middleware";
import controller from './task.controller';
import taskCommentsRouter from './modules/task-comment/task-comment.router';
import taskLogsRouter from './modules/task-log/task-log.router';
import taskFilesRouter from './modules/task-files/task-files.router';
import { trimObjectForKeys } from "../transformers";
import { taskService } from "./task.service";
import { TaskDto } from "./dtos/task.dto";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDtoAndInjectId(CreateTaskDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:taskId/*',
  injectQueryFiltersfromParams(
    trimObjectForKeys(['taskId:id'])
  ),
  findResourceByRequestQueryFilters<TaskDto>(taskService),
);

/** Nested task comments */
router.use(`/:taskId/comments`, taskCommentsRouter);

/** Nested task logs */
router.use(`/:taskId/logs`, taskLogsRouter);

/** Nested task files */
router.use(`/:taskId/files`, taskFilesRouter);

export const taskRouteConfig: RouteConfig = {
  path: '/tasks',
  router,
};
