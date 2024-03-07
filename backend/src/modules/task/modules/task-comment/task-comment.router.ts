import express from "express";
import controller from './task-comment.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto } from "../../../common/validators";
import { CreateTaskCommentDto } from "./dtos/create-task-comment.dto";
import { injectParamsForQueryFilter } from "../../../middleware";
import taskCommentFilesRouter from './modules/task-comment-files/task-comment-files.router';
import { trimExistingParamsForKeys } from "../../../transformers";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:taskId' */

router.route('/')
  .all(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['taskId', 'id'])
    )
  )
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateTaskCommentDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['taskId', 'id'])
    )
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

/** Nested task comments */
router.use(`/:taskCommentId/files`, taskCommentFilesRouter);

export default router;
