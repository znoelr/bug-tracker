import express from "express";
import controller from './task-comment-files.controller';
import { routeFactory } from "../../../../../common/route-handlers";
import { QueryOptions } from "../../../../../common/fetch-objects";
import { injectParamsForQueryFilter, injectQueryOptions } from "../../../../../middleware";
import { jsonInterceptor } from "../../../../../interceptors";
import { CreateTaskCommentFilesDto } from "./dtos/create-task-comment-files.dto";
import { validateDto } from "../../../../../common/validators";
import { injectComposedKeyIntoParams, toEntityForKey, toEntityListForKey, trimExistingParamsForKeys } from "../../../../../transformers";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:taskCommentId' */

router.use(injectQueryOptions(
  new QueryOptions().setInclude({ file: true })
));

router.route('/')
  .all(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['taskCommentId'])
    ),
    jsonInterceptor(toEntityListForKey('file'))
  )
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateTaskCommentFilesDto),
    createRoute(controller.create)
  );

router.route('/:fileId')
  .all(
    injectParamsForQueryFilter(
      injectComposedKeyIntoParams(['taskCommentId', 'fileId'])
    ),
    jsonInterceptor(toEntityForKey('file'))
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
