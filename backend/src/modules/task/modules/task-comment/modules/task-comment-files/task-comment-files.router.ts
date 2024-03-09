import express from "express";
import controller from './task-comment-files.controller';
import { routeFactory } from "../../../../../common/route-handlers";
import { QueryOptions } from "../../../../../common/fetch-objects";
import { createRequestBodyFromParams, findResourceByRequestQueryFilters, injectParamsForQueryFilter, injectQueryOptions, throwBadRequestIfResourceExistByQueryFilters } from "../../../../../middleware";
import { jsonInterceptor } from "../../../../../interceptors";
import { CreateTaskCommentFilesDto } from "./dtos/create-task-comment-files.dto";
import { validateDto } from "../../../../../common/validators";
import { createComposedKeyFromParams, toEntityForKey, toEntityListForKey, trimExistingParamsForKeys } from "../../../../../transformers";
import { TaskCommentFilesDto } from "./dtos/task-comment-files.dto";
import { taskCommentFilesService } from "./task-comment-files.service";
import { FileDto } from "../../../../../file/dtos/file.dto";
import { fileService } from "../../../../../file/file.service";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:taskCommentId' */

router.use(injectQueryOptions(
  new QueryOptions().setInclude({ file: true })
));

router.route('/')
  .get(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['taskCommentId'])
    ),
    jsonInterceptor(toEntityListForKey('file')),
    createRoute(controller.findAll)
  )
;

router.route('/:fileId')
  .all(
    injectParamsForQueryFilter(
      createComposedKeyFromParams(['taskCommentId', 'fileId'])
    ),
    jsonInterceptor(toEntityForKey('file'))
  )
  .get(createRoute(controller.findById))
  .post(
    throwBadRequestIfResourceExistByQueryFilters<TaskCommentFilesDto>(taskCommentFilesService),
    // taskComment record already exists up to this point,
    // check only for file record
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['fileId:id'])
    ),
    findResourceByRequestQueryFilters<FileDto>(fileService),
    createRequestBodyFromParams(['taskCommentId', 'fileId']),
    validateDto(CreateTaskCommentFilesDto),
    createRoute(controller.create)
  )
  .delete(
    findResourceByRequestQueryFilters<TaskCommentFilesDto>(taskCommentFilesService),
    createRoute(controller.delete)
  )
;

export default router;
