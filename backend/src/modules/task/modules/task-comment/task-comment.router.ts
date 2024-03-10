import express from "express";
import controller from './task-comment.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDtoAndInjectId } from "../../../common/validators";
import { CreateTaskCommentDto } from "./dtos/create-task-comment.dto";
import { findResourceByRequestQueryFilters, injectQueryFiltersfromParams } from "../../../middleware";
import taskCommentFilesRouter from './modules/task-comment-files/task-comment-files.router';
import { trimObjectForKeys } from "../../../transformers";
import { taskCommentService } from "./task-comment.service";
import { TaskCommentDto } from "./dtos/task-comment.dto";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:taskId' */

router.route('/')
  .all(
    injectQueryFiltersfromParams(
      trimObjectForKeys(['taskId'])
    )
  )
  .get(createRoute(controller.findAll))
  .post(
    validateDtoAndInjectId(CreateTaskCommentDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(
    injectQueryFiltersfromParams(
      trimObjectForKeys(['taskId', 'id'])
    )
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:taskCommentId/*',
  injectQueryFiltersfromParams(
    trimObjectForKeys(['taskCommentId:id'])
  ),
  findResourceByRequestQueryFilters<TaskCommentDto>(taskCommentService),
);

/** Nested task comments */
router.use(`/:taskCommentId/files`,taskCommentFilesRouter);

export default router;
