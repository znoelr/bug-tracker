import express from "express";
import controller from './task-files.controller';
import fileController from '../../../file/file.controller';
import { routeFactory } from "../../../../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../../../../common/validators";
import {
  injectQueryOptions,
  injectQueryFiltersfromRequest,
  createRequestBodyForKeys,
  findResourceByRequestQueryFilters,
  parseUrlQueryForQueryOptionsSortBy,
  injectTransformedQueryOptions,
  parseUrlQueryForQueryOptionsSelect,
} from "../../../../middleware";
import { QueryOptions } from "../../../../common/types";
import { jsonInterceptor } from "../../../../interceptors";
import { CreateTaskFilesDto } from "./dtos/create-task-files.dto";
import {
  createComposedKeyFromObjectKeys,
  injectSelectOrIncludeQueryOptionsForKey,
  toEntityForKey,
  toEntityListForKey,
  trimObjectForKeys,
  trimOnlyFirstEntryOfSortByForField,
} from "../../../../transformers";
import { CreateFileDto } from "../../../file/dtos/create-file.dto";
import { TaskFilesDto } from "./dtos/task-files.dto";
import { taskFilesService } from "./task-files.service";
import { FileSortDto } from "../../../file/dtos/file-sort.dto";
import { FileDto } from "../../../file/dtos/file.dto";
import { restrictTo } from "../../../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../../../permission/permission.constants";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);
const createFileRoute = routeFactory(fileController);

/** ROUTES DEFINED WITH PREFIX '/:taskId' */

router.use(
  parseUrlQueryForQueryOptionsSelect(FileDto),
  injectTransformedQueryOptions(injectSelectOrIncludeQueryOptionsForKey('file')),
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.TASK),
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.FILE),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['taskId'])
    ),
    parseUrlQueryForQueryOptionsSortBy(FileSortDto),
    injectTransformedQueryOptions(trimOnlyFirstEntryOfSortByForField('file')),
    jsonInterceptor(toEntityListForKey('file')),
    createRoute(controller.findAll)
  )
  .post(
    restrictTo(PERMISSION_ACTION.CREATE_LINK, PERMISSION_RESOURCE.TASK),
    restrictTo(PERMISSION_ACTION.CREATE, PERMISSION_RESOURCE.FILE),
    injectQueryOptions(new QueryOptions()),
    validateDtoAndInjectId(CreateFileDto),
    createFileRoute(fileController.create, { endRequest: false }),
    createRequestBodyForKeys({
      paramKeys: ['taskId'],
      bodyKeys: ['id:fileId'],
    }),
    parseUrlQueryForQueryOptionsSelect(FileDto),
    injectTransformedQueryOptions(injectSelectOrIncludeQueryOptionsForKey('file')),
    jsonInterceptor(toEntityForKey('file')),
    validateDto(CreateTaskFilesDto),
    createRoute(controller.create)
  )
;

router.route('/:fileId')
  .all(
    injectQueryFiltersfromRequest('params')(
      createComposedKeyFromObjectKeys(['taskId', 'fileId'])
    )
  )
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.TASK),
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.FILE),
    jsonInterceptor(toEntityForKey('file')),
    createRoute(controller.findById),
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE_LINK, PERMISSION_RESOURCE.TASK),
    restrictTo(PERMISSION_ACTION.DELETE, PERMISSION_RESOURCE.FILE),
    findResourceByRequestQueryFilters<TaskFilesDto>(taskFilesService),
    injectQueryOptions(new QueryOptions()),
    createRoute(controller.delete, { endRequest: false }),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['fileId:id'])
    ),
    createFileRoute(fileController.delete),
  )
;

export default router;
