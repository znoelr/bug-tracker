import express from "express";
import controller from './project-files.controller';
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
import { CreateProjectFilesDto } from "./dtos/create-project-files.dto";
import {
  createComposedKeyFromObjectKeys,
  injectSelectOrIncludeQueryOptionsForKey,
  toEntityForKey,
  toEntityListForKey,
  trimObjectForKeys,
  trimOnlyFirstEntryOfSortByForField,
} from "../../../../transformers";
import { CreateFileDto } from "../../../file/dtos/create-file.dto";
import { ProjectFilesDto } from "./dtos/project-files.dto";
import { projectFilesService } from "./project-files.service";
import { FileSortDto } from "../../../file/dtos/file-sort.dto";
import { FileDto } from "../../../file/dtos/file.dto";
import { restrictTo } from "../../../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../../../permission/permission.constants";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);
const createFileRoute = routeFactory(fileController);

/** ROUTES DEFINED WITH PREFIX '/:projectId' */

router.use(
  parseUrlQueryForQueryOptionsSelect(FileDto),
  injectTransformedQueryOptions(injectSelectOrIncludeQueryOptionsForKey('file')),
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.PROJECT_FILE),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['projectId'])
    ),
    parseUrlQueryForQueryOptionsSortBy(FileSortDto),
    injectTransformedQueryOptions(trimOnlyFirstEntryOfSortByForField('file')),
    jsonInterceptor(toEntityListForKey('file')),
    createRoute(controller.findAll)
  )
  .post(
    restrictTo(PERMISSION_ACTION.CREATE, PERMISSION_RESOURCE.PROJECT_FILE),
    injectQueryOptions(() => new QueryOptions()),
    validateDtoAndInjectId(CreateFileDto),
    createFileRoute(fileController.create, { endRequest: false }),
    createRequestBodyForKeys({
      paramKeys: ['projectId'],
      bodyKeys: ['id:fileId'],
    }),
    parseUrlQueryForQueryOptionsSelect(FileDto),
    injectTransformedQueryOptions(injectSelectOrIncludeQueryOptionsForKey('file')),
    jsonInterceptor(toEntityForKey('file')),
    validateDto(CreateProjectFilesDto),
    createRoute(controller.create)
  );

router.route('/:fileId')
  .all(
    injectQueryFiltersfromRequest('params')(
      createComposedKeyFromObjectKeys(['projectId', 'fileId'])
    )
  )
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.PROJECT_FILE),
    jsonInterceptor(toEntityForKey('file')),
    createRoute(controller.findById)
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE, PERMISSION_RESOURCE.PROJECT_FILE),
    findResourceByRequestQueryFilters<ProjectFilesDto>(projectFilesService),
    injectQueryOptions(() => new QueryOptions()),
    createRoute(controller.delete, { endRequest: false }),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['fileId:id'])
    ),
    createFileRoute(fileController.delete)
  );

export default router;
