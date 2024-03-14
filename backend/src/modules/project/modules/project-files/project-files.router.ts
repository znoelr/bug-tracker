import express from "express";
import controller from './project-files.controller';
import fileController from '../../../file/file.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../../../common/validators";
import {
  injectQueryOptions,
  injectQueryFiltersfromRequest,
  createRequestBodyForKeys,
  findResourceByRequestQueryFilters,
  parseUrlQueryForQueryOptionsSortBy,
  injectTransformedQueryOptions,
  parseUrlQueryForQueryOptionsSelect,
} from "../../../middleware";
import { QueryOptions } from "../../../common/types";
import { jsonInterceptor } from "../../../interceptors";
import { CreateProjectFilesDto } from "./dtos/create-project-files.dto";
import {
  createComposedKeyFromObjectKeys,
  injectSelectOrIncludeQueryOptionsForKey,
  toEntityForKey,
  toEntityListForKey,
  trimObjectForKeys,
  trimOnlyFirstEntryOfSortByForField,
} from "../../../transformers";
import { CreateFileDto } from "../../../file/dtos/create-file.dto";
import { ProjectFilesDto } from "./dtos/project-files.dto";
import { projectFilesService } from "./project-files.service";
import { FileSortDto } from "../../../file/dtos/file-sort.dto";
import { FileDto } from "../../../file/dtos/file.dto";

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
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['projectId'])
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
    jsonInterceptor(toEntityForKey('file')),
    createRoute(controller.findById)
  )
  .delete(
    findResourceByRequestQueryFilters<ProjectFilesDto>(projectFilesService),
    injectQueryOptions(new QueryOptions()),
    createRoute(controller.delete, { endRequest: false }),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['fileId:id'])
    ),
    createFileRoute(fileController.delete)
  );

export default router;
