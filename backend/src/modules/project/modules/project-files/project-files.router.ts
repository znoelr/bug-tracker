import express from "express";
import controller from './project-files.controller';
import fileController from '../../../file/file.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../../../common/validators";
import { injectQueryOptions, injectQueryFiltersfromParams, createRequestBodyForKeys, throwBadRequestIfResourceExistByQueryFilters, findResourceByRequestQueryFilters } from "../../../middleware";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { CreateProjectFilesDto } from "./dtos/create-project-files.dto";
import { createComposedKeyFromParams, toEntityForKey, toEntityListForKey, trimExistingParamsForKeys } from "../../../transformers";
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
    injectQueryFiltersfromParams(
      trimExistingParamsForKeys(['projectId'])
    ),
    jsonInterceptor(toEntityListForKey('file')),
    createRoute(controller.findAll)
  )
  .post(
    injectQueryOptions(new QueryOptions()),
    validateDtoAndInjectId(CreateFileDto),
    createFileRoute(fileController.createForLinking),
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
    injectQueryFiltersfromParams(
      createComposedKeyFromParams(['projectId', 'fileId'])
    )
  )
  .get(
    jsonInterceptor(toEntityForKey('file')),
    createRoute(controller.findById)
  )
  .delete(
    findResourceByRequestQueryFilters<ProjectFilesDto>(projectFilesService),
    injectQueryOptions(new QueryOptions()),
    createRoute(controller.deleteLinked),
    injectQueryFiltersfromParams(
      trimExistingParamsForKeys(['fileId:id'])
    ),
    createFileRoute(fileController.delete)
  );

export default router;
