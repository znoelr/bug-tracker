import express from "express";
import controller from './task-comment-files.controller';
import { routeFactory } from "../../../../../common/route-handlers";
import { QueryOptions } from "../../../../../common/types";
import { createRequestBodyForKeys, findResourceByRequestQueryFilters, injectQueryFiltersfromRequest, injectQueryOptions } from "../../../../../middleware";
import { jsonInterceptor } from "../../../../../interceptors";
import { validateDto, validateDtoAndInjectId } from "../../../../../common/validators";
import { createComposedKeyFromObjectKeys, toEntityForKey, toEntityListForKey, trimObjectForKeys } from "../../../../../transformers";
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
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['taskCommentId'])
    ),
    jsonInterceptor(toEntityListForKey('file')),
    createRoute(controller.findAll)
  )
  .post(
    injectQueryOptions(new QueryOptions()),
    validateDtoAndInjectId(CreateFileDto),
    createFileRoute(fileController.create, { endRequest: false }),
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
    injectQueryFiltersfromRequest('params')(
      createComposedKeyFromObjectKeys(['taskCommentId', 'fileId'])
    )
  )
  .get(
    jsonInterceptor(toEntityForKey('file')),
    createRoute(controller.findById)
  )
  .delete(
    findResourceByRequestQueryFilters<TaskCommentFilesDto>(taskCommentFilesService),
    injectQueryOptions(new QueryOptions()),
    createRoute(controller.delete, { endRequest: false }),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['fileId:id'])
    ),
    createFileRoute(fileController.delete)
  )
;

export default router;
