import express from "express";
import controller from './task-comment-files.controller';
import { routeFactory } from "../../../../../common/route-handlers";
import { QueryOptions } from "../../../../../common/types";
import {
  createRequestBodyForKeys,
  findResourceByRequestQueryFilters,
  injectQueryFiltersfromRequest,
  injectQueryOptions,
  injectTransformedQueryOptions,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
} from "../../../../../middleware";
import { jsonInterceptor } from "../../../../../interceptors";
import {
  validateDto,
  validateDtoAndInjectId,
} from "../../../../../common/validators";
import {
  createComposedKeyFromObjectKeys,
  injectSelectOrIncludeQueryOptionsForKey,
  toEntityForKey,
  toEntityListForKey,
  trimObjectForKeys,
  trimOnlyFirstEntryOfSortByForField,
} from "../../../../../transformers";
import { TaskCommentFilesDto } from "./dtos/task-comment-files.dto";
import { taskCommentFilesService } from "./task-comment-files.service";
import fileController from '../../../../../file/file.controller';
import { CreateFileDto } from "../../../../../file/dtos/create-file.dto";
import { CreateTaskCommentFilesDto } from "./dtos/create-task-comment-files.dto";
import { FileSortDto } from "../../../../../file/dtos/file-sort.dto";
import { FileDto } from "../../../../../file/dtos/file.dto";

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
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['taskCommentId'])
    ),
    parseUrlQueryForQueryOptionsSortBy(FileSortDto),
    injectTransformedQueryOptions(trimOnlyFirstEntryOfSortByForField('file')),
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
