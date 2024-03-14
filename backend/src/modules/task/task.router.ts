import express from "express";
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { validateDto, validateDtoAndInjectId } from "../common/validators";
import {
  findResourceByRequestQueryFilters,
  injectQueryFiltersfromRequest,
  parseParamsForQueryFilter,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
  validateUniqueKeysFromRequest,
} from "../middleware";
import controller from './task.controller';
import taskCommentsRouter from './modules/task-comment/task-comment.router';
import taskLogsRouter from './modules/task-log/task-log.router';
import taskFilesRouter from './modules/task-files/task-files.router';
import { trimObjectForKeys } from "../transformers";
import { taskService } from "./task.service";
import { TaskDto } from "./dtos/task.dto";
import { UpdateTaskDto } from "./dtos/update-task.dto";
import { TaskSortDto } from "./dtos/task-sort.dto";

const router = express.Router();
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(TaskDto)
);

router.route('/')
  .get(
    parseUrlQueryForQueryOptionsSortBy(TaskSortDto),
    createRoute(controller.findAll)
  )
  .post(
    validateDtoAndInjectId(CreateTaskDto),
    validateUniqueKeysFromRequest<TaskDto>('body')(taskService, ['title']),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(
    validateDto(UpdateTaskDto),
    validateUniqueKeysFromRequest<TaskDto>('body')(taskService, ['title']),
    createRoute(controller.update)
  )
  .delete(createRoute(controller.delete));

/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:taskId/*',
  injectQueryFiltersfromRequest('params')(
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
