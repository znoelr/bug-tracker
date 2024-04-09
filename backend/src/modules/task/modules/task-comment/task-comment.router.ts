import express from "express";
import controller from './task-comment.controller';
import { routeFactory } from "../../../../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../../../../common/validators";
import { CreateTaskCommentDto } from "./dtos/create-task-comment.dto";
import {
  extendRequestBodyForKeys,
  findResourceByRequestQueryFilters,
  injectQueryFiltersfromRequest,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
  transformRequestBody,
} from "../../../../middleware";
import taskCommentFilesRouter from './modules/task-comment-files/task-comment-files.router';
import { trimObjectForKeys } from "../../../../transformers";
import { taskCommentService } from "./task-comment.service";
import { TaskCommentDto } from "./dtos/task-comment.dto";
import { TaskCommentSortDto } from "./dtos/task-comment-sort.dto";
import { restrictTo } from "../../../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../../../permission/permission.constants";
import { UpdateTaskCommentDto } from "./dtos/update-task-comment.dto";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:taskId' */

router.use(
  parseUrlQueryForQueryOptionsSelect(TaskCommentDto)
);

router.use('/',
  injectQueryFiltersfromRequest('params')(
    trimObjectForKeys(['taskId'])
  )
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.TASK_COMMENT),
    parseUrlQueryForQueryOptionsSortBy(TaskCommentSortDto),
    createRoute(controller.findAll)
  )
  .post(
    restrictTo(PERMISSION_ACTION.CREATE, PERMISSION_RESOURCE.TASK_COMMENT),
    validateDtoAndInjectId(CreateTaskCommentDto),
    extendRequestBodyForKeys({
      paramKeys: ['taskId'],
    }),
    createRoute(controller.create)
  );

router.use('/:id',
  injectQueryFiltersfromRequest('params')(
    trimObjectForKeys(['taskId', 'id'])
  )
);

router.route('/:id')
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.TASK_COMMENT),
    createRoute(controller.findById)
  )
  .patch(
    restrictTo(PERMISSION_ACTION.UPDATE, PERMISSION_RESOURCE.TASK_COMMENT),
    validateDto(UpdateTaskCommentDto),
    findResourceByRequestQueryFilters<TaskCommentDto>(taskCommentService),
    createRoute(controller.update)
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE, PERMISSION_RESOURCE.TASK_COMMENT),
    findResourceByRequestQueryFilters<TaskCommentDto>(taskCommentService),
    createRoute(controller.delete)
  );

/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:taskCommentId/*',
  injectQueryFiltersfromRequest('params')(
    trimObjectForKeys(['taskCommentId:id'])
  ),
  findResourceByRequestQueryFilters<TaskCommentDto>(taskCommentService),
);

/** Nested task comments */
router.use(`/:taskCommentId/files`,taskCommentFilesRouter);

export default router;
