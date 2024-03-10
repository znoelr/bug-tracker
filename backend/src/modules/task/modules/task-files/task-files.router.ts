import express from "express";
import controller from './task-files.controller';
import fileController from '../../../file/file.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../../../common/validators";
import { injectQueryOptions, injectParamsForQueryFilter, createRequestBodyForKeys, throwBadRequestIfResourceExistByQueryFilters, findResourceByRequestQueryFilters } from "../../../middleware";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { CreateTaskFilesDto } from "./dtos/create-task-files.dto";
import { createComposedKeyFromParams, toEntityForKey, toEntityListForKey, trimExistingParamsForKeys } from "../../../transformers";
import { CreateFileDto } from "../../../file/dtos/create-file.dto";
import { TaskFilesDto } from "./dtos/task-files.dto";
import { taskFilesService } from "./task-files.service";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);
const createFileRoute = routeFactory(fileController);

/** ROUTES DEFINED WITH PREFIX '/:taskId' */

router.use(injectQueryOptions(
  new QueryOptions().setInclude({ file: true })
));

router.route('/')
  .get(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['taskId'])
    ),
    jsonInterceptor(toEntityListForKey('file')),
    createRoute(controller.findAll)
  )
  .post(
    injectQueryOptions(new QueryOptions()),
    validateDtoAndInjectId(CreateFileDto),
    createFileRoute(fileController.createForLinking),
    createRequestBodyForKeys({
      paramKeys: ['taskId'],
      bodyKeys: ['id:fileId'],
    }),
    injectQueryOptions(
      new QueryOptions().setInclude({ file: true })
    ),
    jsonInterceptor(toEntityForKey('file')),
    validateDto(CreateTaskFilesDto),
    createRoute(controller.create)
  )
;

router.route('/:fileId')
  .all(
    injectParamsForQueryFilter(
      createComposedKeyFromParams(['taskId', 'fileId'])
    )
  )
  .get(
    jsonInterceptor(toEntityForKey('file')),
    createRoute(controller.findById),
  )
  .delete(
    findResourceByRequestQueryFilters<TaskFilesDto>(taskFilesService),
    injectQueryOptions(new QueryOptions()),
    createRoute(controller.deleteLinked),
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['fileId:id'])
    ),
    createFileRoute(fileController.delete),
  )
;

export default router;
