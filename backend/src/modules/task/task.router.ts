import express from "express";
import { RouteConfig } from "../../common/types";
import { routeFactory } from "../../common/route-handlers";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { validateDto, validateDtoAndInjectId } from "../../common/validators";
import {
  findResourceByRequestQueryFilters,
  injectQueryFiltersfromRequest,
  parseParamsForQueryFilter,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
  transformRequestBody,
  validateUniqueKeysFromRequest,
} from "../../middleware";
import controller from './task.controller';
import taskCommentsRouter from './modules/task-comment/task-comment.router';
import taskLogsRouter from './modules/task-log/task-log.router';
import taskFilesRouter from './modules/task-files/task-files.router';
import { trimObjectForKeys } from "../../transformers";
import { taskService } from "./task.service";
import { TaskDto } from "./dtos/task.dto";
import { UpdateTaskDto } from "./dtos/update-task.dto";
import { TaskSortDto } from "./dtos/task-sort.dto";
import { restrictTo } from "../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../permission/permission.constants";
import { injectTaskStatus } from "./transformers/inject-status.transformer";
import { validateSeverityByType } from "./middlewares/validate-severity.middleware";

const router = express.Router();
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(TaskDto)
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.TASK),
    parseUrlQueryForQueryOptionsSortBy(TaskSortDto),
    createRoute(controller.findAll)
  )
  .post(
    restrictTo(PERMISSION_ACTION.CREATE, PERMISSION_RESOURCE.TASK),
    validateDtoAndInjectId(CreateTaskDto),
    validateSeverityByType,
    validateUniqueKeysFromRequest<TaskDto>('body')(taskService, ['title']),
    transformRequestBody(injectTaskStatus()),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.TASK),
    createRoute(controller.findById)
  )
  .patch(
    restrictTo(PERMISSION_ACTION.UPDATE, PERMISSION_RESOURCE.TASK),
    validateDto(UpdateTaskDto),
    findResourceByRequestQueryFilters<TaskDto>(taskService),
    validateSeverityByType,
    validateUniqueKeysFromRequest<TaskDto>('body')(taskService, ['title']),
    createRoute(controller.update)
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE, PERMISSION_RESOURCE.TASK),
    findResourceByRequestQueryFilters<TaskDto>(taskService),
    createRoute(controller.delete)
  );

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
