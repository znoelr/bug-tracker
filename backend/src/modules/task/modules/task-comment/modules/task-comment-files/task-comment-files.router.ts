import express from "express";
import controller from './task-comment-files.controller';
import { routeFactory } from "../../../../../common/route-handlers";
import { QueryOptions } from "../../../../../common/fetch-objects";
import { createRequestBodyForKeys, findResourceByRequestQueryFilters, injectParamsForQueryFilter, injectQueryOptions } from "../../../../../middleware";
import { jsonInterceptor } from "../../../../../interceptors";
import { validateDto, validateDtoAndInjectId } from "../../../../../common/validators";
import { createComposedKeyFromParams, toEntityForKey, toEntityListForKey, trimExistingParamsForKeys } from "../../../../../transformers";
import { TaskCommentFilesDto } from "./dtos/task-comment-files.dto";
import { taskCommentFilesService } from "./task-comment-files.service";
import fileController from '../../../../../file/file.controller';
import { CreateFileDto } from "../../../../../file/dtos/create-file.dto";
import { CreateTaskCommentFilesDto } from "./dtos/create-task-comment-files.dto";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);
const createFileRoute = routeFactory(fileController);

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
  .post(
    injectQueryOptions(new QueryOptions()),
    validateDtoAndInjectId(CreateFileDto),
    createFileRoute(fileController.createForLinking),
    createRequestBodyForKeys({
      paramKeys: ['taskCommentId'],
      bodyKeys: ['id:fileId'],
    }),
    injectQueryOptions(
      new QueryOptions().setInclude({ file: true })
    ),
    jsonInterceptor(toEntityForKey('file')),
    validateDto(CreateTaskCommentFilesDto),
    createRoute(controller.create),
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
  .delete(
    injectQueryOptions(new QueryOptions()),
    findResourceByRequestQueryFilters<TaskCommentFilesDto>(taskCommentFilesService),
    // Delete taskCommentFile record
    createRoute(controller.deleteLinked),
    // Delete File record
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['fileId:id'])
    ),
    createFileRoute(fileController.delete)
  )
;

export default router;
