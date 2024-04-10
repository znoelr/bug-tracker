import express from "express";
import controller from './task-comment-files.controller';
import { routeFactory } from "../../../../../../common/route-handlers";
import { QueryOptions } from "../../../../../../common/types";
import {
  createRequestBodyForKeys,
  endBySendJsonFromRequestBody,
  findResourceByRequestQueryFilters,
  injectQueryFiltersfromRequest,
  injectQueryOptions,
  injectTransformedQueryOptions,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
} from "../../../../../../middleware";
import { jsonInterceptor } from "../../../../../../interceptors";
import {
  validateDto,
  validateDtoAndInjectId,
} from "../../../../../../common/validators";
import {
  createComposedKeyFromObjectKeys,
  injectSelectOrIncludeQueryOptionsForKey,
  toEntityForKey,
  toEntityListForKey,
  trimObjectForKeys,
  trimOnlyFirstEntryOfSortByForField,
} from "../../../../../../transformers";
import { TaskCommentFilesDto } from "./dtos/task-comment-files.dto";
import { taskCommentFilesService } from "./task-comment-files.service";
import fileController from '../../../../../file/file.controller';
import { CreateFileDto } from "../../../../../file/dtos/create-file.dto";
import { CreateTaskCommentFilesDto } from "./dtos/create-task-comment-files.dto";
import { FileSortDto } from "../../../../../file/dtos/file-sort.dto";
import { FileDto } from "../../../../../file/dtos/file.dto";
import { restrictTo } from "../../../../../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../../../../../permission/permission.constants";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);
const createFileRoute = routeFactory(fileController);

/** ROUTES DEFINED WITH PREFIX '/:taskCommentId' */

router.use(
  parseUrlQueryForQueryOptionsSelect(FileDto),
  injectTransformedQueryOptions(injectSelectOrIncludeQueryOptionsForKey('file')),
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.TASK_COMMENT_FILE),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['taskCommentId'])
    ),
    parseUrlQueryForQueryOptionsSortBy(FileSortDto),
    injectTransformedQueryOptions(trimOnlyFirstEntryOfSortByForField('file')),
    jsonInterceptor(toEntityListForKey('file')),
    createRoute(controller.findAll)
  )
  .post(
    restrictTo(PERMISSION_ACTION.CREATE, PERMISSION_RESOURCE.TASK_COMMENT_FILE),
    injectQueryOptions(() => new QueryOptions()),
    validateDtoAndInjectId(CreateFileDto),
    createFileRoute(fileController.create, { endRequest: false }),
    createRequestBodyForKeys({
      paramKeys: ['taskCommentId'],
      bodyKeys: ['id:fileId'],
    }),
    parseUrlQueryForQueryOptionsSelect(FileDto),
    injectTransformedQueryOptions(injectSelectOrIncludeQueryOptionsForKey('file')),
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
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.TASK_COMMENT_FILE),
    createRoute(controller.findById, { endRequest: false }),
    jsonInterceptor(toEntityForKey('file')),
    endBySendJsonFromRequestBody
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE, PERMISSION_RESOURCE.TASK_COMMENT_FILE),
    findResourceByRequestQueryFilters<TaskCommentFilesDto>(taskCommentFilesService),
    injectQueryOptions(() => new QueryOptions()),
    createRoute(controller.delete, { endRequest: false }),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['fileId:id'])
    ),
    createFileRoute(fileController.delete)
  )
;

export default router;
