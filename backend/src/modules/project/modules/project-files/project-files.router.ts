import express from "express";
import controller from './project-files.controller';
import fileController from '../../../file/file.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../../../common/validators";
import { injectQueryOptions, injectQueryFiltersfromRequest, createRequestBodyForKeys, throwBadRequestIfResourceExistByQueryFilters, findResourceByRequestQueryFilters } from "../../../middleware";
import { QueryOptions } from "../../../common/types";
import { jsonInterceptor } from "../../../interceptors";
import { CreateProjectFilesDto } from "./dtos/create-project-files.dto";
import { createComposedKeyFromObjectKeys, toEntityForKey, toEntityListForKey, trimObjectForKeys } from "../../../transformers";
import { CreateFileDto } from "../../../file/dtos/create-file.dto";
import { ProjectFilesDto } from "./dtos/project-files.dto";
import { projectFilesService } from "./project-files.service";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);
const createFileRoute = routeFactory(fileController);

/** ROUTES DEFINED WITH PREFIX '/:projectId' */

router.use(injectQueryOptions(
  new QueryOptions().setInclude({ file: true })
));

router.route('/')
  .get(
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['projectId'])
    ),
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
    injectQueryOptions(
      new QueryOptions().setInclude({ file: true })
    ),
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
